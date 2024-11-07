import apiConfig from "./api-config";

class HomeService {
  fetchAds() {
    return apiConfig.get('/fetchAds');
  }

  fetchAbout(){
    return apiConfig.get('/fetchAbout');
  }

  notify(data:any){
    return apiConfig.post('/notify',data);
  }
}

export default new HomeService();