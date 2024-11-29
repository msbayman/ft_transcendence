function Profile_side() {
  return (
    <div className="from-box profile">
      <div className="prf-pic">
        <div className="cover-pic">
          <div className="union-bg-pic">
            <div className="profile-pic"></div>
          </div>
        </div>
        <div className="params">
          <span className="username">
            <label>Username</label>
            <input type="text" placeholder="Username" />
          </span>
          <span className="eml">
            <label>Email</label>
            <input type="text" placeholder="Email" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Profile_side;
