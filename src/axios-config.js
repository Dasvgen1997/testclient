import axios from "axios";
import config from "./config";

axios.defaults.baseURL = config.API_URL;

