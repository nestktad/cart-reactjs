import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Category({ data }) {
  return (
    <ul>
      {data?.map((c) => (
        <li key={c.id}>
          <Link to={`/products/category/${c.id}`}>{c.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    fetch("http://localhost:9999/categories")
      .then((res) => res.json())
      .then((result) => setCategories(result));
      
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  
  if (userRole === 'admin') {
    return null;
  }

  return (
    <div>
      <h1>Categories</h1>
      <Category data={categories} />
    </div>
  );
};
