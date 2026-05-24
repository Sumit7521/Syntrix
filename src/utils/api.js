import axios from "axios";

const api = axios.create({
  baseURL: "https://ml-models-backend-wh0k.onrender.com",
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 15000
});

const hfApi = axios.create({
  baseURL: "https://sumit7521-cyber-ids-api.hf.space",
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 30000
});

// Predict attack (Binary on Render)
export const predictAttack = async (payload, model) => {
  const response = await api.post(
    "/predict",
    payload,
    {
      params: { model } 
    }
  );

  return response.data;
};

// Predict attack (Multiclass on Hugging Face)
export const predictMulticlassAttack = async (payload, model) => {
  const endpointMap = {
    hybrid: "/predict/hybrid",
    xgb: "/predict/xgboost",
    cat: "/predict/catboost",
    ada: "/predict/adaboost",
    rf: "/predict/randomforest",
    cnn: "/predict/cnn",
    knn: "/predict/knn",
    svc: "/predict/svm",
    lr: "/predict/naivebayes"
  };

  const endpoint = endpointMap[model] || "/predict/xgboost";
  const response = await hfApi.post(endpoint, payload);
  return response.data;
};

export default api;

