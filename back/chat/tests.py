from django.test import TestCase

# Create your tests here.
def recive(self, data):
        mydata = json.load(data)
        if data.type == 'recv_msg':
            self.channel_layer.groupsend(self.channelname, self.groupname)