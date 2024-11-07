import apiConfig from "./api-config";

class SellerService {
    fetchOrders(status:number,filter:any){
        const queryParams = new URLSearchParams(filter).toString();

        return apiConfig.get(`/seller/order/getOrders/${status}?${queryParams}`);
    }

    fetchOrder(orderId: string,status:number){
        return apiConfig.get(`/seller/order/getOrder/${orderId}/${status}`);
    }
    
    updateOrder(orderID:string,canceledOrders:any,selectedPerson:any){
        return apiConfig.put(`/seller/order/updateOrder`,{orderID,canceledOrders,selectedPerson});
    }

    fetchOrderStats(){
        return apiConfig.get(`/seller/order/getOrderStats`);
    }

    
    inventory(filter:any) { 
        const query = new URLSearchParams(filter);
 
       return apiConfig.get(`/seller/inventory?${query}`);
     }

     notInInventory(filter:any) { 
        const query = new URLSearchParams(filter);

      return apiConfig.get(`/seller/notInInventory?${query}`);
    }

    fetchGProducts(search:any){
        return apiConfig.post(`/seller/fetchGProducts`,search);
    }

    uploadImage(productID:string,image:any){
        return apiConfig.post(`/seller/uploadProductImage`,{productID:productID,image:image});
    }

    addProduct(product:any){
        return apiConfig.post(`/seller/addProduct`,product);
    }

    AddToInventory(data:any){
        return apiConfig.post(`/seller/addToInventory`,data);
    }

    removeInventory(id:string){
        return apiConfig.delete(`/removeFromInventory/${id}`);
    }

    fetchStoreUser(phone:any){
        return apiConfig.get(`/seller/fetchStoreUser/${phone}`);
    }

    submitAddPerson(data:any){
        return apiConfig.post(`/seller/submitAddPerson`,data);
    }

    getStorePerson(filter:any){
        const query = new URLSearchParams(filter);

        return apiConfig.get(`/seller/getStorePerson?${query}`);
    }

    updateStorePerson(data:any){
        return apiConfig.put(`/seller/updateStorePerson`,data)
    }

    fetchPincode(page:any,search:any){
        return apiConfig.get(`/seller/fetchPincode?page=${page}&search=${search}`,);
    }

    updateDelAddress(pincodeID:any,status:any){
        return apiConfig.post(`/seller/updateDeliveryAddress`,{pincodeID,status});
    }

    updateDelCity(cityData:any,status:any){
        return apiConfig.post(`/seller/updateDeliveryCity`,{cityData,status});
    }

    updateDeliveryType(type:any){
        return apiConfig.put(`/seller/updateDeliveryType`,{type});
    }

    updateDeliveryData(data:any){
        return apiConfig.put(`/seller/updateDeliveryData`,data);
    }

    deliverableLocation(page:any){
        return apiConfig.get(`/seller/deliverableLocation?page=${page}`);
    }
    
    updateCustomCharges(charge:any,id:any){
        return apiConfig.put(`/seller/updateCustomCharges`,{charge,id});
    }

    fetchPincodeSearch(pincode:any){

        return apiConfig.post(`/fetchPincode`,{search:pincode}); 

    }

    uploadImageSeller(image:any){
        return apiConfig.post(`/seller/uploadSellerImage`,{image:image});
    }

    removeSellerImage(index:number){
        return apiConfig.delete(`/seller/removeSellerImage/${index}`);
    }

    updateStoreStatus(type:any){
        return apiConfig.put(`/seller/updateStoreStatus`,{type});

    }

    checkGSTIN(gstin:string){
        return apiConfig.post(`/seller/checkGSTIN`,{gstin});
    }

    getStoreCategories(){
        return apiConfig.get(`/categories`);
    }

    saveEnquiryData(data:any){
        return apiConfig.post(`/seller/onBoardEnquiry`,data)
    }
}

export default new SellerService();