describe('Useless test', () => {
    it('should be useless', () => {
        expect(true).toBe(true)
    })

    /*
        let companyController: CompanyController
        let bodyMock: ICategory
        beforeEach(() => {
            companyController = new CompanyController(companyRepositoryMock, new Validator());
            bodyMock = new ICategory();
        })
    */

    /*
        it("should login successfully when credentials are ok", async () => {
            const reponse: string = await userControler.loginUser(sessionMock, bodyMock);
            expect(reponse).to.equals("Logged succesfully!");
            expect(sessionMock.user.email).to.equals(bodyMock.email);
        })
    */

    /*
        it('should respond with 400 BadRequest when password is wrong', async () => {
            const credentials = {
                email: 'test@test.pl',
                password: 'wrongPassword'
            }
            const response = await chai
                .request(app)
                .post('/api/user/login')
                .send(credentials)

            expect(response).to.have.status(400)
            expect(response.body.message).to.equals('Wrong email or password!')
        })
    */
})
