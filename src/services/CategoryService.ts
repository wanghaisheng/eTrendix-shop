import apiConfig from "./api-config";

class CategoryService {
    getAllCategories(){
        const controller = new AbortController();

        const req = apiConfig.get('/getCategories',{signal: controller.signal});

        return {req,cancel: ()=>{controller.abort();}}
    }

    getHomeSliderCategory(){
        return apiConfig.get('/getHomeSliderCategory');
    }
    
    getMainCategory(){
        return apiConfig.get('/getMainCategory');
    }

    getCategories(category: string){
        return apiConfig.get('/subCategory/'+category);
    }

    storeCategories(){
        return apiConfig.get('/categories');
    }
}

export default new CategoryService();