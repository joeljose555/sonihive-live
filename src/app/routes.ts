import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { IndustriesPage } from "./pages/IndustriesPage";
import { WhyPage } from "./pages/WhyPage";
import { Products } from "./pages/Products";
import { ProductDetail } from "./pages/ProductDetail";
import { CategorySubProducts } from "./pages/CategorySubProducts";
import { Solutions } from "./pages/Solutions";
import { SolutionGroupPage } from "./pages/SolutionGroupPage";
import { SolutionDetailPage } from "./pages/SolutionDetailPage";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: AboutPage },
      { path: "contact", Component: ContactPage },
      { path: "industries", Component: IndustriesPage },
      { path: "why", Component: WhyPage },
      // { path: "products", Component: Products },
      // { path: "products/:categorySlug", Component: CategorySubProducts },
      { path: "product/:slug", Component: ProductDetail },
      { path: "solutions/:groupSlug/:itemSlug", Component: SolutionDetailPage },
      // { path: "solutions/:groupSlug", Component: SolutionGroupPage },
      // { path: "solutions", Component: Solutions },
      { path: "*", Component: NotFound },
    ],
  },
]);