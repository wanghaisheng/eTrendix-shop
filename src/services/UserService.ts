import apiConfig from "./api-config";

class UserService {
    login(email: string, password: string){

        return apiConfig.post(`/login`,{email,password});
    }

    loginWithPhone(phone:number){

        return apiConfig.post(`/user/loginWithPhone`,{phone});
    }

    register(data: any){
        return apiConfig.post(`/register`,data);
    }

    me(){
        return apiConfig.get(`/user/me`);
    }

    otpVerify(data:any){
        return apiConfig.post(`/user/otpVerify`,data);
    }

    checkUser(data:any){
        const controller = new AbortController();
        const req =  apiConfig.post(`/checkUser`,data,{signal: controller.signal});
        return {req,cancel: ()=>{controller.abort();}}
    }

    fetchPincode(pincode:any){
      return apiConfig.post(`/fetchPincode`,{search: pincode});
    }

    updateProfile(data:any){
        return apiConfig.put(`/user/updateProfile`,data);
    }

    addAddress(data:any){
        return apiConfig.post(`/user/addAddress`,data);
    }

    addToCart(inventory_id:any,quantity:any,product_id:any,pincode_id:any){
        return apiConfig.post(`/user/cart/addToCart`,{inventory_id,quantity,product_id,pincode_id});
    }

    getCart(pincodeID:any){ 

        return apiConfig.get(`/user/cart/getCart/${pincodeID}`); 
    }

    removeCart(pincodeID:any){
        return apiConfig.delete(`/user/cart/removeCart/${pincodeID}`); 
    }

    savedAddresses(){
        const controller = new AbortController();

        const req =   apiConfig.get(`/user/fetchAddress`);
        return {req,cancel: ()=>{controller.abort();}}

    }

    removeProductCart(cartID:any){
        return apiConfig.delete(`/user/cart/removeProductCart/${cartID}`);
    }

    updateDefaultAddress(address_id:any){
        return apiConfig.put(`/user/updateDefaultAddress`,{id:address_id});
    }

    createOrder(pincodeID:any,method:string,gateway: string){
       return apiConfig.post(`/user/order/createOrder`,{pincodeID,method,gateway});
    }
    paymentProcess(data:any){
        return apiConfig.post(`/user/order/paymentProcess`,{data});
    }

    fetchOrder(receiptID:any){
        const controller = new AbortController();

        const req =   apiConfig.post(`/user/order/fetchOrder`,{receiptID},{signal: controller.signal});
        return {req,cancel: ()=>{controller.abort();}}
    }

    orderHistory(filter:any){

        const queryParams = new URLSearchParams(filter).toString();

       return apiConfig.get(`/user/order/orderHistory?${queryParams}`); 
    }

    orderTracking(id:any){
        return apiConfig.get(`/user/order/orderTracking/${id}`);
    }

    orderTrackingByOrderID(id:any,orderID:any){
        return apiConfig.get(`/user/order/orderTrackingByOrderID/${id}/${orderID}`);
    }

    OrderRecieve(data:any){
        const queryParams = new URLSearchParams(data).toString();
       return apiConfig.get(`/seller/order/orderRecieve?${queryParams}`);
    }

    OrderConfirm(orderID:any,OTP:any){
        return apiConfig.post(`/seller/order/orderConfirm`,{orderID,OTP});
    }

    fetchCartGroup(){
        return apiConfig.get(`/user/cart/cartGroup`);
    }

    postReview(data:any){
        return apiConfig.post(`/user/order/postReview`,data);
    }

    uploadReviewImage(image: any,id: string){
        return apiConfig.post(`/user/order/uploadReviewImage`,{image,id})
    }

    uploadReturnImage(image: any,id: any){
        return apiConfig.post(`/user/order/uploadReturnImage`,{image,id})
    }

    getReviews(slug:any,filter:any){
        const queryParams = new URLSearchParams(filter).toString();
        return apiConfig.get(`/getReview/${slug}?${queryParams}`);
    }

    addToWishlist(product_id:any){
        return apiConfig.post(`/user/cart/addToWishlist`,{product_id});
    }

    getWishlistProductIDs(){
        return apiConfig.get(`/user/cart/getWishlistProductIDs`);
    }

    getWishlistProductID(product_id:any){
        return apiConfig.get(`/user/cart/getWishlistProductID?product_id=${product_id}`);
    }

    fetchStore(slug:string){
        return apiConfig.get(`/fetchStore/${slug}`);
    }

    orderCancel(data:any){
        return apiConfig.post('/user/order/orderCancel',data);
    }

    orderReturn(data:any){
        return apiConfig.post('/user/order/orderReturn',data);
    }

    OrderReturnData(data:any){
        const queryParams = new URLSearchParams(data).toString();

        return  apiConfig.get(`/user/order/OrderReturnData?${queryParams}`);
    }

    returnOrderSubmit(data:any){
        return apiConfig.post('/user/order/returnOrderSubmit',data)
    }

    rejectOrder(data:any){
        return apiConfig.post('/user/order/rejectOrder',{data});
    }

    calculateStoreRatingsReview(slug: string){
        return apiConfig.get('/calculateStoreRatingsReview/'+slug);
     }

     fetchSearchSuggestions(){
        return apiConfig.get('/user/fetchSearchSuggestions');
     }

     fetchNotifications(){
        return apiConfig.get('/user/notification/fetch');
     }

     markNotificationAsRead(id:string){
        return apiConfig.put('/user/notification/markNotificationAsRead/'+id);
     }

     fetchStoreRequest(){
        return apiConfig.get('/user/notification/fetchStoreRequest');
     }

     respondStoreRequest(id: string,status:string){
        return apiConfig.put(`/user/notification/respondStoreRequest/${id}/${status}`);
     }

     updateCartQuantity(id: string,quantity:number){
        return apiConfig.put('/user/cart/updateCartQuantity',{id,quantity});
     }
}


export default new UserService();