import { RESTDataSource } from "apollo-datasource-rest";

class IdentityDataSource extends RESTDataSource {

    constructor() {
        super();
        this.baseURL = process.env.IDENTITY_SERVICE_URL;
    }
}

export default IdentityDataSource;