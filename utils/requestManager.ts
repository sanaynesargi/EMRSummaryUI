import axios from "axios";

const API_BASE_URL = "/api";

interface APIResponse {
  error: string | null;
  data: any | null;
}

const getAPIData = async (url: string, params: any) => {
  const req = await axios.get(url, { params });

  const responseCode = req.status;
  const responseData = req.data;

  if (responseCode != 200) {
    let retObj: APIResponse = {
      error: "Non 200 Status Code",
      data: null,
    };

    return retObj;
  }

  // Server Error w/ message
  if (responseData.error) {
    let retObj: APIResponse = {
      error: responseData.error,
      data: null,
    };

    return retObj;
  }

  let retObj: APIResponse = {
    error: null,
    data: responseData.data,
  };

  return retObj;
};

const postAPIData = async (url: string, body: any) => {
  const req = await axios.post(url, { body });

  const responseCode = req.status;
  const responseData = req.data;

  if (responseCode != 200) {
    let retObj: APIResponse = {
      error: "Non 200 Status Code",
      data: null,
    };

    return retObj;
  }

  // Server Error w/ message
  if (responseData.error) {
    let retObj: APIResponse = {
      error: responseData.error,
      data: null,
    };

    return retObj;
  }

  let retObj: APIResponse = {
    error: null,
    data: responseData.data,
  };

  return retObj;
};

// API Endpoints
const clientsEndpoint = `${API_BASE_URL}/patients`;
const summaryEndpoint = `${API_BASE_URL}/summary`;

// API Request Calls -> React Query
export const fetchClients = async () => {
  return await getAPIData(clientsEndpoint, {});
};

export const fetchSummary = async (clientId: string) => {
  return await getAPIData(summaryEndpoint, { clientId });
};
