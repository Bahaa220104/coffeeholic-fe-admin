import {
  Building2,
  Grid2x2,
  House,
  MessageCircleQuestion,
  MessageSquareMore,
  Shapes,
  ShoppingBasket,
  SquareMenu,
  UsersIcon,
  UtensilsCrossed,
} from "lucide-react";
import BusinessInformation from "../../views/admin/business.view";
import Tables from "../../views/admin/tables.view";
import Categories from "../../views/admin/categories/categories.view";
import Dashboard from "../../views/admin/dashboard.view";
import FAQ from "../../views/admin/faqs/faq.view";
import Feedback from "../../views/admin/feedback/feedbacks.view";
import Orders from "../../views/admin/orders/orders.view";
import Product from "../../views/admin/products/product.view";
import Products from "../../views/admin/products/products.view";
import Reservations from "../../views/admin/reservations/reservations.view";
import Users from "../../views/admin/users/users.view";
import Category from "../../views/admin/categories/category.view";
import Order from "../../views/admin/orders/order.view";
import Reservation from "../../views/admin/reservations/reservation.view";
import FAQs from "../../views/admin/faqs/faqs.view";

export default [
  {
    id: 1,
    icon: <House size={18} />,
    label: "Dashboard",
    type: "single",
    to: "",
    element: <Dashboard />,
  },

  {
    label: "Menu",
    routes: [
      {
        id: 2,
        icon: <SquareMenu size={18} />,
        label: "Products",
        type: "single",
        to: "products",
        element: <Products />,
        children: [{ to: "products/:id", element: <Product /> }],
      },
      {
        id: 3,
        icon: <Shapes size={18} />,
        label: "Categories",
        type: "single",
        to: "categories",
        element: <Categories />,
        children: [{ to: "categories/:id", element: <Category /> }],
      },
      {
        id: 6,
        icon: <Grid2x2 size={18} />,
        label: "Tables Layout",
        type: "single",
        to: "tables",
        element: <Tables />,
      },
    ],
    type: "group",
  },
  {
    label: "Fulfillment",
    routes: [
      {
        id: 4,
        icon: <ShoppingBasket size={18} />,
        label: "Orders",
        type: "single",
        to: "orders",
        element: <Orders />,
        children: [{ to: "orders/:id", element: <Order /> }],
      },
      {
        id: 5,
        icon: <UtensilsCrossed size={18} />,
        label: "Reservations",
        type: "single",
        to: "reservations",
        element: <Reservations />,
        children: [{ to: "reservations/:id", element: <Reservation /> }],
      },
    ],
    type: "group",
  },
  {
    label: "Users & Feedback",
    routes: [
      {
        id: 7,
        icon: <UsersIcon size={18} />,
        label: "Users",
        type: "single",
        to: "users",
        element: <Users />,
      },
      {
        id: 8,
        icon: <MessageSquareMore size={18} />,
        label: "Feedback",
        type: "single",
        to: "feedback",
        element: <Feedback />,
      },
    ],
    type: "group",
  },
  {
    label: "Info",
    routes: [
      {
        id: 10,
        icon: <Building2 size={18} />,
        label: "Business information",
        type: "single",
        to: "business",
        element: <BusinessInformation />,
      },
      {
        id: 11,
        icon: <MessageCircleQuestion size={18} />,
        label: "FAQ",
        type: "single",
        to: "faqs",
        element: <FAQs />,
        children: [{ to: "faqs/:id", element: <FAQ /> }],
      },
    ],
    type: "group",
  },
];
