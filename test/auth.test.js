// test/auth.test.js

import { use, expect } from 'chai'
import chaiHttp from 'chai-http'
import app from '../server.js'; // Note the ".js" extension
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const chai = use(chaiHttp)

describe('Auth API', () => {
    describe('POST /auth/register', () => {
        it('should register a new user', (done) => {
            chai.request(app)
                .post('/auth/register')
                .send({
                    username: `testuser_${generateString(10)}`,
                    password: 'password123'
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message').eql('User registered');
                    done();
                });
        });

        it('should not register a user with an existing username', (done) => {
            chai.request(app)
                .post('/auth/register')
                .send({
                    username: 'testuser',
                    password: 'password123'
                })
                .end((err, res) => {
                    expect(res).to.have.status(409);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message').eql('User exist');
                    done();
                });
        });
    });

    describe('POST /auth/login', () => {
        it('should login a user', (done) => {
            chai.request(app)
                .post('/auth/login')
                .send({
                    username: 'testuser',
                    password: 'password123'
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('token');
                    done();
                });
        });

        it('should not login with incorrect password', (done) => {
            chai.request(app)
                .post('/auth/login')
                .send({
                    username: 'testuser',
                    password: 'wrongpassword'
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message').eql('Invalid credentials');
                    done();
                });
        });

        it('should not login a non-existing user', (done) => {
            chai.request(app)
                .post('/auth/login')
                .send({
                    username: 'nonexistinguser',
                    password: 'password123'
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message').eql('User not found');
                    done();
                });
        });
    });
});

describe('Product API', () => {
    let authToken;
    before((done) => {
        chai.request(app)
            .post('/auth/login')
            .send({
                username: 'testuser',
                password: 'password123'
            })
            .end((err, res) => {
                authToken = res.body.token;
                done();
            });
    });
    
    describe('GET /products', () => {
        it('should get all products', (done) => {
            chai.request(app)
                .get('/products')
                .set('Authorization', `${authToken}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    // describe('POST /auth/login', () => {
    //     it('should login a user', (done) => {
    //         chai.request(app)
    //             .post('/auth/login')
    //             .send({
    //                 username: 'testuser',
    //                 password: 'password123'
    //             })
    //             .end((err, res) => {
    //                 expect(res).to.have.status(200);
    //                 expect(res.body).to.be.an('object');
    //                 expect(res.body).to.have.property('token');
    //                 done();
    //             });
    //     });

    //     it('should not login with incorrect password', (done) => {
    //         chai.request(app)
    //             .post('/auth/login')
    //             .send({
    //                 username: 'testuser',
    //                 password: 'wrongpassword'
    //             })
    //             .end((err, res) => {
    //                 expect(res).to.have.status(401);
    //                 expect(res.body).to.be.an('object');
    //                 expect(res.body).to.have.property('message').eql('Invalid credentials');
    //                 done();
    //             });
    //     });

    //     it('should not login a non-existing user', (done) => {
    //         chai.request(app)
    //             .post('/auth/login')
    //             .send({
    //                 username: 'nonexistinguser',
    //                 password: 'password123'
    //             })
    //             .end((err, res) => {
    //                 expect(res).to.have.status(400);
    //                 expect(res.body).to.be.an('object');
    //                 expect(res.body).to.have.property('message').eql('User not found');
    //                 done();
    //             });
    //     });
    // });
});
// describe('Product API', () => {
//     // before((done) => {
//     //     chai.request(app)
//     //         .post('/auth/login')
//     //         .send({
//     //             username: 'testuser',
//     //             password: 'password123'
//     //         })
//     //         .end((err, res) => {
//     //             authToken = res.body.token;
//     //             done();
//     //         });
//     // });

//     describe('GET /products', () => {

//         // before( function () {
//         //     chai.request(app)
//         //         .post('/auth/login')
//         //         .send({
//         //             username: 'testuser',
//         //             password: 'password123'
//         //         })
//         //         .end((err, res) => {
//         //             authToken = res.body.token;
//         //             done();
//         //         });
//         // });
//         it('should get all products', (done) => {
//             chai.request(app)
//                 .get('/products')
//                 .set('Authorization', `Bearer ${authToken}`)
//                 .end((err, res) => {
//                     expect(res).to.have.status(200);
//                     expect(res.body).to.be.an('array');
//                     done();
//                 });
//         });
//     });

//     describe('GET /products/:id', () => {
//         it('should get a product by ID', (done) => {
//             const productId = 1; // Assuming there is a product with ID 1
//             chai.request(app)
//                 .get(`/products/${productId}`)
//                 .set('Authorization', `Bearer ${authToken}`)
//                 .end((err, res) => {
//                     expect(res).to.have.status(200);
//                     expect(res.body).to.be.an('object');
//                     expect(res.body).to.have.property('productID').eql(productId);
//                     done();
//                 });
//         });

//         it('should return 404 for a non-existing product', (done) => {
//             const nonExistingProductId = 9999;
//             chai.request(app)
//                 .get(`/products/${nonExistingProductId}`)
//                 .set('Authorization', `Bearer ${authToken}`)
//                 .end((err, res) => {
//                     expect(res).to.have.status(404);
//                     expect(res.body).to.be.an('object');
//                     expect(res.body).to.have.property('message').eql('Product not found');
//                     done();
//                 });
//         });
//     });
// });
