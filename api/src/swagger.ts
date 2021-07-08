import { getPets } from "./open-api/pets.swagger";

export const swaggerDocument = {
  openapi: "3.0.1",
  info: {
    version: "1.0.0",
    title: "APIs Document",
    description: "your description here",
    termsOfService: "",
    contact: {
      name: "Tran Son hoang",
      email: "son.hoang01@gmail.com",
      url: "https://hoangtran.co",
    },
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },
  servers: [
    { url: "http://localhost:3000/api/v1", description: "Local server" },
    { url: "http://app-dev.herkuapp.com/api/v1", description: "DEV Env" },
    { url: "https://app-uat-herkuapp.com/api/v1", description: "UAT Env" },
  ],
  tags: [{ name: "Pets" }],
  paths: {
    "/pets": { get: getPets },
  },
};
