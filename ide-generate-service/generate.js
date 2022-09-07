angular.module('ideGenerate', [])
    .provider('generateApi', function GenerateApiProvider() {
        this.generateServiceUrl = '/services/v4/ide/generate';
        this.generateModelServiceUrl = '/services/v4/js/ide-generate-service/generate.mjs';
        this.$get = ['$http', function generateApiFactory($http) {

            let generateFromTemplate = function (workspace, project, file, template, parameters = []) {
                let url = new UriBuilder().path(this.generateServiceUrl.split('/')).path('file').path(workspace).path(project).path(file.split('/')).build();
                return $http.post(url, { "template": template, "parameters": parameters })
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Publisher service:', response);
                        return { status: response.status };
                    });
            }.bind(this);

            let generateFromModel = function (workspace, project, file, template, parameters = []) {
                let url = new UriBuilder().path(this.generateModelServiceUrl.split('/')).path('model').path(workspace).path(project).build();
                url = `${url}?path=${file.split('/')}`;
                return $http.post(url, { "template": template, "parameters": parameters, "model": file })
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Publisher service:', response);
                        return { status: response.status };
                    });
            }.bind(this);

            return {
                generateFromTemplate: generateFromTemplate,
                generateFromModel: generateFromModel,
            };
        }];
    });