#!/bin/bash

# Generate CA if it doesn't exist
if [ ! -f config/certs/ca.zip ]; then
    echo "Creating CA"
    bin/elasticsearch-certutil ca --silent --pem -out config/certs/ca.zip
    unzip config/certs/ca.zip -d config/certs
fi

# Generate certificates if they don't exist
if [ ! -f config/certs/certs.zip ]; then
    echo "Creating certs"
    echo -e "instances:\n  - name: es\n    dns:\n      - es\n      - localhost\n      - 127.0.0.1\n  - name: kibana\n    dns:\n      - kibana\n      - localhost\n      - 127.0.0.1" > config/certs/instances.yml

    bin/elasticsearch-certutil cert --silent --pem \
        --ca-cert config/certs/ca/ca.crt \
        --ca-key config/certs/ca/ca.key \
        --in config/certs/instances.yml \
        -out config/certs/certs.zip

    unzip config/certs/certs.zip -d config/certs
fi

# Set proper permissions
echo "Setting file permissions"
chown -R root:root config/certs

# Wait for Elasticsearch to be available
echo "Waiting for Elasticsearch availability"
until curl -s --cacert /usr/share/elasticsearch/config/certs/ca/ca.crt https://es:9200 | grep -q "missing authentication credentials"; do 
    sleep 10
done

# Set kibana_system password
echo "Setting kibana_system password"
until curl -s -X POST --cacert config/certs/ca/ca.crt \
    -u "elastic:ayman" \
    -H "Content-Type: application/json" \
    https://es:9200/_security/user/kibana_system/_password \
    -d "{\"password\":\"ayman\"}" | grep -q "^{}"; do 
    sleep 10
done

# Create ILM policy
echo "Creating ILM policy"
until curl -s -X PUT -u "elastic:ayman" --cacert config/certs/ca/ca.crt \
    -H "Content-Type: application/json" \
    https://es:9200/_ilm/policy/ilm_policy -d '
    {
    "policy": {
        "phases": {
        "hot": {
            "min_age": "0ms",
            "actions": {
            "set_priority": {
                "priority": 100
            }
            }
        },
        "warm": {
            "min_age": "10d",
            "actions": {
            "set_priority": {
                "priority": 50
            }
            }
        },
        "cold": {
            "min_age": "60d",
            "actions": {
            "freeze": {}
            }
        },
        "delete": {
            "min_age": "90d",
            "actions": {
            "delete": {}
            }
        }
        }
    }
    }' | grep -q '^{"acknowledged":true}'; do 
    sleep 10
done

# Configure index template
echo "Configuring index templates settings."
until curl -s -X PUT "https://es:9200/_index_template/logs_template" \
    --cacert config/certs/ca/ca.crt \
    -u "elastic:ayman" \
    -H "Content-Type: application/json" \
    -d '{
        "index_patterns": ["logs-*"],
        "template": {
            "settings": {
                "index.lifecycle.name": "ilm_policy",
                "number_of_shards": 1,
                "number_of_replicas": 0
            }
        }
    }' | grep -q '^{"acknowledged":true}'; do 
    sleep 10
done

echo "All done!"

# Start Elasticsearch
exec /usr/local/bin/docker-entrypoint.sh elasticsearch