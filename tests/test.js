/**
 * Created by ssn on 8/28/2016.
 */

var request = require('request');
var expect = require('chai').expect;
describe('careAxiom-Test', function() {

var server = 'http://127.0.0.1:9090';

    describe('query is /I/want/title/?address=google.com', function(){
        this.timeout(1000*30);
        it('should return 200 & html response with rendered titles (Google)', function(done) {
            request.get(server+'/I/want/title/?address=google.com',function(err, result, body){
                expect(body).to.have.string('Google');
                expect(body).to.have.string('http://www.google.com');
                expect(result.statusCode).to.be.equal(200);
                done();

            });
        });
    });


    describe('query is /I/want/title/?address=google.com&address=www.dawn.com/events/ ', function(){
        this.timeout(1000*40);
        it('should return 200 & html response with rendered titles (Google, Events - DAWN.COM - DAWN.COM)', function(done) {
            request.get(server+'/I/want/title/?address=google.com&address=www.dawn.com/events/',function(err, result, body){
              //  console.log(body);
                expect(body).to.have.string('Google');
                expect(body).to.have.string('http://www.google.com');
                expect(body).to.have.string('http://www.google.com');
                expect(body).to.have.string('Events - DAWN.COM - DAWN.COM');
                expect(body).to.have.string('www.dawn.com/events/');
                expect(result.statusCode).to.be.equal(200);
                done();

            });
        });
    });


    describe('query is /I/want/title/?address=google.com&address=www.dawn.com/events/&address=www.facebook.com ', function(){
        this.timeout(1000*60);
        it('should return 200 & html response with rendered titles (Google, Events - DAWN.COM - DAWN.COM, Facebook)', function(done) {
            request.get(server+'/I/want/title/?address=google.com&address=www.dawn.com/events/&address=www.facebook.com',function(err, result, body){
                expect(body).to.have.string('Google');
                expect(body).to.have.string('http://www.google.com');
                expect(body).to.have.string('http://www.google.com');
                expect(body).to.have.string('Events - DAWN.COM - DAWN.COM');
                expect(body).to.have.string('www.dawn.com/events/');
                expect(body).to.have.string('Facebook');
                expect(body).to.have.string('www.facebook.com');
                expect(result.statusCode).to.be.equal(200);
                done();

            });
        });
    });


    describe('query is /I/want/This ', function(){
        it('should return 404 Not Found', function(done) {
            request.get(server+'/I/want/This',function(err, result, body){
                //console.log(body);
                // console.log(result.statusCode);
                expect(body).to.be.a('string');
                expect(body).to.be.equal('Not Found');
                expect(result.statusCode).to.be.equal(404);
                done();

            });
        });
    });



    describe('query is /I/want/title?address=asdsadedrio ', function(){
        it('should contain getaddrinfo ENOTFOUND', function(done) {
            request.get(server+'/I/want/title?address=asdsadedrio',function(err, result, body){
               // console.log(body);
                // console.log(result.statusCode);

                expect(body).to.have.string('getaddrinfo ENOTFOUND');
                expect(result.statusCode).to.be.equal(200);
                done();

            });
        });
    });


});