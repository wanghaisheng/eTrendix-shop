import apiConfig from "./api-config";

class RestAPIService {
    rev_geocode(lat:any,lng:any){
       return apiConfig.get(`/revGeocode?lat=${lat}&lng=${lng}`);
    }

    mappls_oauth(){
        const controller = new AbortController();

        const req =   apiConfig.get(`/user/mapplsOAuth`,{signal: controller.signal});
        return {req,cancel: ()=>{controller.abort();}}
    }
}

export default new RestAPIService();
