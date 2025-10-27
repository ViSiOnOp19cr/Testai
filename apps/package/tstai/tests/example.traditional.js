import request from 'supertest';
import { expect } from 'chai';

const baseurl = 'https://jsonplaceholder.typicode.com';

describe('JSONPlaceholder API Tests', () => {
  
  it('should get posts and return 200 status', async () => {
    const response = await request(baseurl)
      .get('/posts')
      .expect(200);
    
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    expect(response.body[0]).to.have.property('id');
    expect(response.body[0]).to.have.property('title');
    expect(response.body[0]).to.have.property('body');
  });

  // Test 2: POST /posts with title and body data, expect status 201
  it('should create a new post and return 201 status', async () => {
    const postData = {
      title: 'Test Post Title',
      body: 'This is a test post body content',
      userId: 1
    };

    const response = await request(baseurl)
      .post('/posts')
      .send(postData)
      .expect(201);
    
    expect(response.body).to.have.property('id');
    expect(response.body.title).to.equal(postData.title);
    expect(response.body.body).to.equal(postData.body);
    expect(response.body.userId).to.equal(postData.userId);
  });

  // Test 3: GET /users/1 endpoint returns 200 and user data
  it('should get user by id and return 200 status', async () => {
    const response = await request(baseurl)
      .get('/users/1')
      .expect(200);
    
    expect(response.body).to.have.property('id', 1);
    expect(response.body).to.have.property('name');
    expect(response.body).to.have.property('email');
    expect(response.body).to.have.property('username');
  });

  // Test 4: GET /posts with query parameter userId=1, expect status 200
  it('should get posts by userId query parameter and return 200 status', async () => {
    const response = await request(baseurl)
      .get('/posts')
      .query({ userId: 1 })
      .expect(200);
    
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    response.body.forEach(post => {
      expect(post.userId).to.equal(1);
    });
  });

  // Test 5: GET /posts/999999 returns 404 not found
  it('should return 404 for non-existent post', async () => {
    await request(baseurl)
      .get('/posts/999999')
      .expect(404);
  });
});