import faker from "faker";
import sinon from "sinon";
import requestSuperTest from "supertest";
import { createToken } from "../../../../shared/utils/token";
import { statusCode } from "../../../../shared/utils/status-code";
import { usersRequestFixture, usersFixture } from "../fixtures";
import { UserResponse, UserRequest } from "../../dto";
import serverBuilder from "../../../../server-builder";
import { UserRepository } from "../../repository";
import { User } from "../../model";
describe("PUT /users/:userId", () => {
  const sandbox = sinon.createSandbox();

  let _request;
  let _token;
  let _dbStub;
  let _userRepositoryStub;

  beforeAll(async () => {
    _userRepositoryStub = sandbox.createStubInstance(UserRepository);

    _dbStub = {
      userRepository: _userRepositoryStub,
    };

    _request = requestSuperTest(await serverBuilder({ db: _dbStub }));
    _token = createToken({
      id: faker.random.uuid(),
      name: faker.name.findName(),
      enabled: true,
    });
  });

  afterAll(() => {
    sandbox.restore();
  });

  afterEach(() => {
    _userRepositoryStub.findOne.reset();
    _userRepositoryStub.merge.reset();
    _userRepositoryStub.find.reset();
    _userRepositoryStub.save.reset();
  });

  describe("successes", () => {
    test("Should update a user", async () => {
      const data: UserRequest = usersRequestFixture();
      const persistedData: User = usersFixture();

      // Mocking data
      _userRepositoryStub.findOne
        .withArgs(persistedData.id)
        .resolves(persistedData);

      _userRepositoryStub.find.resolves([]);

      _userRepositoryStub.merge.callsFake((user, req) =>
        Object.assign(user, req)
      );

      _userRepositoryStub.save
        .withArgs(sinon.match.object)
        .callsFake((user) => Promise.resolve(user));

      const res = await _request
        .put(`/users/${persistedData.id}`)
        .set("Authorization", `Bearer ${_token}`)
        .send(data);

      const user = res.body as UserResponse;

      expect(res.status).toBe(statusCode.OK);
      expect(res.body.password).toBeUndefined();
      expect(user.id).toBe(persistedData.id);
      expect(user.name).toBe(data.name);
      expect(user.cpf).toBe(data.cpf);
      expect(user.enabled).toBe(persistedData.enabled);
      expect(user.createdAt).toBe(persistedData.createdAt.toISOString());
      expect(user.updatedAt).toBe(persistedData.updatedAt.toISOString());
    });
  });

  describe("failures", () => {
    test("Should not update a user with unauthorized user", async () => {
      const data: UserRequest = usersRequestFixture();
      const persistedData: User = usersFixture();

      // Mocking data
      _userRepositoryStub.findOne
        .withArgs(persistedData.id)
        .resolves(persistedData);

      _userRepositoryStub.find.resolves([]);

      _userRepositoryStub.merge.callsFake((user, req) =>
        Object.assign(user, req)
      );

      _userRepositoryStub.save
        .withArgs(sinon.match.object)
        .callsFake((user) => Promise.resolve(user));
      const res = await _request.put(`/users/${persistedData.id}`).send(data);

      expect(res.status).toBe(statusCode.UNAUTHORIZED);
    });

    test("Should not update a user with a not legit auth token", async () => {
      const data: UserRequest = usersRequestFixture();
      const persistedData: User = usersFixture();

      // Mocking data
      _userRepositoryStub.findOne
        .withArgs(persistedData.id)
        .resolves(persistedData);

      _userRepositoryStub.merge.callsFake((user, req) =>
        Object.assign(user, req)
      );

      _userRepositoryStub.find.resolves([]);

      _userRepositoryStub.save
        .withArgs(sinon.match.object)
        .callsFake((user) => Promise.resolve(user));

      const _invalidToken = createToken({
        id: faker.random.uuid(),
        name: faker.name.findName(),
        enabled: true,
        secret: `invalid secret`,
      });

      const res = await _request
        .put(`/users/${persistedData.id}`)
        .set("Authorization", `Bearer ${_invalidToken}`)
        .send(data);

      expect(res.status).toBe(statusCode.UNAUTHORIZED);
    });

    test(`Should not update a user's name only`, async () => {
      const persistedData: User = usersFixture();
      const data = {
        name: faker.name.findName(),
      };

      // Mocking data
      _userRepositoryStub.findOne
        .withArgs(persistedData.id)
        .resolves(persistedData);

      _userRepositoryStub.merge.callsFake((user, req) =>
        Object.assign(user, req)
      );

      _userRepositoryStub.find.resolves([]);

      _userRepositoryStub.save
        .withArgs(sinon.match.object)
        .callsFake((user) => Promise.resolve(user));

      const res = await _request
        .put(`/users/${persistedData.id}`)
        .set("Authorization", `Bearer ${_token}`)
        .send(data);

      const user = res.body as UserResponse;

      expect(res.status).toBe(statusCode.BAD_REQUEST);
    });

    test(`Should not update a user's CPF only`, async () => {
      const persistedData: User = usersFixture();
      const data = {
        cpf: faker.helpers.replaceSymbolWithNumber("###.###.###-##"),
      };
      // Mocking data
      _userRepositoryStub.findOne
        .withArgs(persistedData.id)
        .resolves(persistedData);

      _userRepositoryStub.merge.callsFake((user, req) =>
        Object.assign(user, req)
      );

      _userRepositoryStub.find.resolves([]);

      _userRepositoryStub.save
        .withArgs(sinon.match.object)
        .callsFake((user) => Promise.resolve(user));

      const res = await _request
        .put(`/users/${persistedData.id}`)
        .set("Authorization", `Bearer ${_token}`)
        .send(data);

      const user = res.body as UserResponse;

      expect(res.status).toBe(statusCode.BAD_REQUEST);
    });

    test(`Should not update a user's enabled only`, async () => {
      const persistedData: User = usersFixture();
      const data = {
        phone: faker.helpers.replaceSymbolWithNumber("(##) # ####-####"),
      };

      // Mocking data
      _userRepositoryStub.findOne
        .withArgs(persistedData.id)
        .resolves(persistedData);

      _userRepositoryStub.find.resolves([]);

      _userRepositoryStub.merge.callsFake((user, req) =>
        Object.assign(user, req)
      );

      _userRepositoryStub.save
        .withArgs(sinon.match.object)
        .callsFake((user) => Promise.resolve(user));

      _userRepositoryStub.save.resolves(Object.assign({}, persistedData, data));

      const res = await _request
        .put(`/users/${persistedData.id}`)
        .set("Authorization", `Bearer ${_token}`)
        .send(data);

      const user = res.body as UserResponse;

      expect(res.status).toBe(statusCode.BAD_REQUEST);
    });

    test("Should not update a user with a CPF that already exists", async () => {
      const data: UserRequest = usersRequestFixture();
      const persistedData: User = usersFixture();
      const anotherUserData: User = usersFixture({ cpf: data.cpf });

      // Mocking data
      _userRepositoryStub.findOne
        .withArgs(persistedData.id)
        .resolves(persistedData);

      _userRepositoryStub.find
        .withArgs({ cpf: anotherUserData.cpf })
        .resolves([anotherUserData]);

      _userRepositoryStub.merge.callsFake((user, req) =>
        Object.assign(user, req)
      );

      _userRepositoryStub.save
        .withArgs(sinon.match.object)
        .callsFake((user) => Promise.resolve(user));

      _userRepositoryStub.save.resolves(Object.assign({}, persistedData, data));

      const res = await _request
        .put(`/users/${persistedData.id}`)
        .set("Authorization", `Bearer ${_token}`)
        .send(data);

      expect(res.status).toBe(statusCode.CONFLICT);
    });

    test("Should not update a user with an unknown user ID data", async () => {
      const data: UserRequest = usersRequestFixture();
      const persistedData: User = usersFixture();

      // Mocking data
      _userRepositoryStub.findOne.withArgs(persistedData.id).resolves(null);

      _userRepositoryStub.find.resolves([]);
      _userRepositoryStub.merge.callsFake((user, req) =>
        Object.assign(user, req)
      );

      _userRepositoryStub.save
        .withArgs(sinon.match.object)
        .callsFake((user) => Promise.resolve(user));

      _userRepositoryStub.save.resolves(Object.assign({}, persistedData, data));

      const res = await _request
        .put(`/users/${persistedData.id}`)
        .set("Authorization", `Bearer ${_token}`)
        .send(data);

      expect(res.status).toBe(statusCode.NOT_FOUND);
    });

    test("Should not update a user with an invalid user ID UUID format", async () => {
      const data: UserRequest = usersRequestFixture();
      const persistedData: User = usersFixture();
      persistedData.id = "invalid_user_id";

      // Mocking data
      _userRepositoryStub.findOne
        .withArgs(persistedData.id)
        .resolves(persistedData);

      _userRepositoryStub.find.resolves([]);

      _userRepositoryStub.merge.callsFake((user, req) =>
        Object.assign(user, req)
      );

      _userRepositoryStub.save
        .withArgs(sinon.match.object)
        .callsFake((user) => Promise.resolve(user));

      _userRepositoryStub.save.resolves(Object.assign({}, persistedData, data));

      const res = await _request
        .put(`/users/${persistedData.id}`)
        .set("Authorization", `Bearer ${_token}`)
        .send(data);

      expect(res.status).toBe(statusCode.NOT_FOUND);
    });

    test("Should return error 500 when DB operation fails", async () => {
      const data: UserRequest = usersRequestFixture();
      const persistedData: User = usersFixture();

      // Mocking data
      _userRepositoryStub.findOne.rejects();

      _userRepositoryStub.find.resolves([]);

      _userRepositoryStub.merge.callsFake((user, req) =>
        Object.assign(user, req)
      );

      _userRepositoryStub.save
        .withArgs(sinon.match.object)
        .callsFake((user) => Promise.resolve(user));

      _userRepositoryStub.save.rejects();

      const res = await _request
        .put(`/users/${persistedData.id}`)
        .set("Authorization", `Bearer ${_token}`)
        .send(data);

      expect(res.status).toBe(statusCode.INTERNAL_SERVER_ERROR);
    });
  });
});
