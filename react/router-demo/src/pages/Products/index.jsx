import { Outlet, Link } from "react-router-dom";
export default function Products(){

    return (
        <>
            <h1>Products</h1>
            <Link to="/products/new">New Product</Link><br />
            <Link to="/products/1">Product Details</Link>
            <Outlet />
        </>
    )
}