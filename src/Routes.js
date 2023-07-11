import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import profileInfo from "./components/loginPage/profileInfo";
import verifyByCell from "./components/loginPage/verifyByCell";

import logInPage from "./pages/logInPage";
import adminPage from "./pages/adminPage";
import adminProduct from "./components/adminPage/adminProduct";
import addColor from "./components/adminPage/product/addColor";
import AddBrand from "./components/adminPage/product/addBrand";
import addSize from "./components/adminPage/product/addSize";
import addCategory from "./components/adminPage/product/addCategory";
import faq from "./components/adminPage/content/faq";
import language from "./components/adminPage/Language";
import addAttributes from './components/adminPage/product/addAttributes'

import productList from "./components/homePage/homeProductList";
import Profile from "./components/homePage/profile/Profile";
import WishList from "./components/homePage/profile/WishList";
import CartPage from "./components/homePage/cart/CartPage";
import AboutUs from "./components/homePage/staticPage/AboutUs";
import Addresses from "./components/homePage/profile/Addresses";
import Users from "./components/adminPage/users/Users";
import Blog from "./components/adminPage/blog/blog";
import AddBlog from "./components/adminPage/blog/AddBlog";
import Tag from "./components/adminPage/tag/adminTag";
import Addtag from "./components/adminPage/tag/adminAddTag";
import contentPage from "./components/adminPage/content/content";
import orderList from "./components/adminPage/orders/orderList";
import FaqPage from "./components/homePage/faqPage";

import Contactus from "./components/homePage/contactus";
import WebsiteBlog from "./components/homePage/blog";
import BlogPage from "./components/homePage/blogPage";
import Order from './components/homePage/profile/Order'
import ChangePassword from "./components/homePage/profile/ChangePassword";
import DiscountList from "./components/adminPage/discount/discountList";

import brandPage from "./components/homePage/brand page/brandPage";
import AddOrder from "./components/adminPage/orders/addOrder";

import AddNewProduct from "./components/adminPage/product/AddNewProduct";
import EditProduct from "./components/adminPage/product/EditProduct";
import DiscountCode from "./components/adminPage/discount/DiscountCode";
import AutoDiscount from "./components/adminPage/discount/AutoDiscount";
import EbMagazine from "./components/homePage/ebMagazine";
import BlogDetail from "./components/homePage/blogDetail";
import ProductDetail from "./components/homePage/homeProductDetail";
import WebContent from "./components/adminPage/content/webContent";
import AppContent from "./components/adminPage/content/appContent";
import HomePage from "./pages/homePage";


export default class Routes extends Component {
    render() {
        return (
            <Switch >
                <Route path="/" exact={true} component={HomePage} />
                <Route path="/loginPage" exact={true} component={logInPage} />
                <Route path="/verifyByCell" exact={true} component={verifyByCell} />
                <Route path="/profileInfo" exact={true} component={profileInfo} />
                <Route path='/home/profile/profile' exact={true} component={Profile} />
                <Route path='/home/profile/wishlist' exact={true} component={WishList} />
                <Route path='/home/cartpage' exact={true} component={CartPage} />
                <Route path="/home/aboutus" exact={true} component={AboutUs} />
                <Route path='/home/profile/addresses' exact={true} component={Addresses} />
                <Route path="/contactus" exact={true} component={Contactus} />
                <Route path="/blog" exact={true} component={WebsiteBlog} />
                <Route path="/blogpage" exact={true} component={BlogPage} />
                <Route path='/home/profile/orders' exact={true} component={Order} />
                <Route path='/home/profile/changepass' exact={true} component={ChangePassword} />
                <Route path="/home/faq" exact={true} component={FaqPage} />
                <Route path="/home/ebMagazine" exact={true} component={EbMagazine} />
                <Route path="/home/ebMagazine/blog/:id" exact={true} component={BlogDetail} />
                <ProtectedRoute path="/admin/product" exact={true} component={adminProduct} />
                <ProtectedRoute path="/admin/blog" exact={true} component={Blog} />
                <ProtectedRoute path="/admin/blog/addblog" exact={true} component={AddBlog} />
                <ProtectedRoute path="/admin/blog/edit" exact={true} component={AddBlog} />
                <ProtectedRoute path="/admin/users" exact={true} component={Users} />
                <ProtectedRoute path="/admin/product/colors" exact={true} component={addColor} />
                <ProtectedRoute path="/admin/product/brands" exact={true} component={AddBrand} />
                <ProtectedRoute path="/admin/product/size" exact={true} component={addSize} />
                <ProtectedRoute path="/admin/product/category" exact={true} component={addCategory} />
                <ProtectedRoute path="/admin/product/attributes" exact={true} component={addAttributes} />
                
                <ProtectedRoute path="/admin/content/faq" exact={true} component={faq} />
                <ProtectedRoute path="/admin/language" exact={true} component={language} />
                <ProtectedRoute path="/admin/tag" exact={true} component={Tag} />
                <ProtectedRoute path="/admin/tag/addtag" exact={true} component={Addtag} />
                <ProtectedRoute path="/admin/product/editProduct" exact={true} component={EditProduct} />
                
                <Route path="/Products/:CategoryName/:TypeName/:GenderValue" exact={true} component={productList} />
                
                <Route path="/Products/:CategoryName/:TypeName/:GenderValue/:productName" exact={true} component={ProductDetail} />
                
                <ProtectedRoute path='/admin/product/add' exact={true} component={AddNewProduct} />
                <ProtectedRoute path='/admin/content/web' exact={true} component={WebContent} />
                <ProtectedRoute path='/admin/content/app' exact={true} component={AppContent} />
                <ProtectedRoute path='/admin/content' exact={true} component={contentPage} />

                <ProtectedRoute path='/admin/orderlist' exact={true} component={orderList} />
                <ProtectedRoute path='/admin/orderlist/add' exact={true} component={AddOrder} />
                
                <ProtectedRoute path='/admin/discounts' exact={true} component={DiscountList} />
                <ProtectedRoute path='/admin/discounts/addDiscountCode' exact={true} component={DiscountCode} />
                <ProtectedRoute path='/admin/discounts/addAutoDiscount' exact={true} component={AutoDiscount} />

                <Route path="/brandpage" exact={true} component={brandPage} />
            </Switch>

        )
    }
}