import { TestBed, inject } from '@angular/core/testing';
import { LambdaDetailsService } from './lambda-details.service';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { AppConfig } from '../../app.config';
import { IFunction, Lambda } from '../../shared/datamodel/k8s/function';
import { IMetaData } from '../../shared/datamodel/k8s/generic/meta-data';

describe('LambdaDetailsService', () => {
    let lambdaDetailsService: LambdaDetailsService;
    let httpClientMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LambdaDetailsService]
        });

        lambdaDetailsService = TestBed.get(LambdaDetailsService);
        httpClientMock = TestBed.get(HttpTestingController);
    });

    it('should get Function', (done) => {
        const name = 'fakeFunctionName';
        const namespace = 'fakeNamespace';
        const token = 'fakeToken';

        lambdaDetailsService.getLambda(name, namespace, token).subscribe((res) => {
            done();
        });
        const req = httpClientMock.expectOne(
            `${AppConfig.kubelessApiUrl}/namespaces/${namespace}/functions/${name}`
        );
        req.flush({});
        expect(req.request.method).toEqual('GET');
        expect(req.request.headers.get('Content-Type')).toEqual('application/json');
        expect(req.request.headers.get('Authorization')).toEqual('Bearer fakeToken');
    });

    it('should create Function', (done) => {
        const md: IMetaData = {
            name: 'fakeFunctionName',
            namespace: 'fakeNamespace'
        }
        const func = new Lambda({
            metadata: md
        });
        const token = 'fakeToken';

        lambdaDetailsService.createLambda(func, token).subscribe((res) => {
            done();
        });
        const req = httpClientMock.expectOne(
            `${AppConfig.kubelessApiUrl}/namespaces/${func.metadata.namespace}/functions/${func.metadata.name}`
        );
        req.flush({});
        expect(req.request.method).toEqual('POST');
        expect(req.request.headers.get('Content-Type')).toEqual('application/json');
        expect(req.request.headers.get('Authorization')).toEqual('Bearer fakeToken');
    });

    it('should update Function', (done) => {
        const md: IMetaData = {
            name: 'fakeFunctionName',
            namespace: 'fakeNamespace'
        }
        const func = new Lambda({
            metadata: md
        });
        const token = 'fakeToken';

        lambdaDetailsService.updateLambda(func, token).subscribe((res) => {
            done();
        });
        const req = httpClientMock.expectOne(
            `${AppConfig.kubelessApiUrl}/namespaces/${func.metadata.namespace}/functions/${func.metadata.name}`
        );
        req.flush({});
        expect(req.request.method).toEqual('PUT');
        expect(req.request.headers.get('Content-Type')).toEqual('application/json');
        expect(req.request.headers.get('Authorization')).toEqual('Bearer fakeToken');
    });

    it('should delete Function', (done) => {
        const name = 'fakeFunctionName';
        const namespace = 'fakeNamespace';
        const token = 'fakeToken';

        lambdaDetailsService.deleteLambda(name, namespace, token).subscribe((res) => {
            done();
        });
        const req = httpClientMock.expectOne(
            `${AppConfig.kubelessApiUrl}/namespaces/${namespace}/functions/${name}`
        );
        req.flush({});
        expect(req.request.method).toEqual('DELETE');
        expect(req.request.headers.get('Content-Type')).toEqual('application/json');
        expect(req.request.headers.get('Authorization')).toEqual('Bearer fakeToken');
    });
});
