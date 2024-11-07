import apiConfig from "./api-config";

class ProductService {
    getProducts(filter:any) {
        const queryParams = new URLSearchParams(filter).toString();

       return apiConfig.get(`/productListing?${queryParams}`);
    }

    getProduct(slug: string){
        const controller = new AbortController();

        const req = apiConfig.get(`/product/${slug}`,{signal:controller.signal});
        return {req,cancel: ()=>{controller.abort();}}
    }

    checkDelivery(product_id:any,pincode:any){
        const controller = new AbortController();

        const req = apiConfig.post(`/checkDelivery`,{pincode:pincode,product_id:product_id},{signal:controller.signal});
        return {req,cancel: ()=>{controller.abort();}}
    }

    getBestSeller(){
        return apiConfig.get('/getBestSeller');
    }
    
    calculateRatingsReview(slug: string){
       return apiConfig.get('/calculateRatingsReview/'+slug);
    }

    getFilters(filters:any){
        const queryParams = new URLSearchParams(filters).toString();

        return apiConfig.get(`/getFilters?${queryParams}`);
    }
}

export default new ProductService();