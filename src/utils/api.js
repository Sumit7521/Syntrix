import axios from "axios";

const api = axios.create({
  baseURL: "https://ml-models-backend-wh0k.onrender.com",
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 15000
});

// Predict attack
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

export default api;
