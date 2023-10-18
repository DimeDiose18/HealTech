import { Dashboard } from "../scenes/Dashboard/Dashboard";
import { TableUpdate } from "../scenes/Tables/TableUpdate";
import { TableUsers } from "../scenes/Tables/TableUsers";
import { Bar } from "../scenes/Graphics/Bar";
import { Pie } from "../scenes/Graphics/Pie";
import { Sales } from "../scenes/Sales/Sales";
import { TableCreate } from "../scenes/Tables/TableCreate";
import { Coupon } from "../scenes/Marketing/Coupon";
import { Update } from '../../ProductUpdate/ProductUpdate'
import UserDetails from "../../userAdmin/userDetails";
import ProductFormView from "../../../views/Product Form/productForm";

export const AdminRoutes = [
  {
    path: '/admin/',
    element: <Dashboard />,
    title: 'dashboard'
  },
  {
    path: 'admin/update',
    element: <Update />,
    title: 'product update'
  },
  {
    path: '/admin/table-update',
    element: <TableUpdate />,
    title: 'table update'
  },
  {
    path: "/admin/table-create",
    element: <TableCreate />,
    title: "table sales",
  },
  {
    path: "/admin/table-create",
    element: <TableCreate />,
    title: "table sales",
  },
  {
    path: '/admin/table-users',
    element: <TableUsers />,
    title: 'table users'
  },
  {
    path: "/admin/sales",
    element: <Sales />,
    title: "table users",
  },
  {
    path: "/admin/coupon",
    element: <Coupon />,
    title: "line graphics",
  },
  {
    path: '/admin/bar',
    element: <Bar />,
    title: 'line graphics'
  },
  {
    path: '/admin/pie',
    element: <Pie />,
    title: 'line graphics'
  },
  {
    path:'/admin/table-users/user-details/:email',
    element: <UserDetails/>,
    title: 'user details'
  },
  {
    path: "/admin/table-create",
    element: <ProductFormView />,
    title: "product-creation",
  },
];
