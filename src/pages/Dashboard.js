function Dashboard() {
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Choose a child, category, and give them stars!</p>
        <form>
          <select>
            <option>Mira</option>
            <option>Shea</option>
          </select>
          <select>
            <option>Kindness</option>
            <option>Chores</option>
          </select>
          <div>
            <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
          </div>
          <button>Give Stars!</button>
        </form>
      </div>
    );
  }
  
  export default Dashboard;
  