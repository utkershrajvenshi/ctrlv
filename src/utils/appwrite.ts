import { Account, Client, Databases, Models, OAuthProvider } from "appwrite"

const ENV_NOT_SET = 'env-not-set'

export class AppwriteInit {
  private _client = new Client()
  private _databases: Databases
  private _account: Account
  public currentSession: Models.Session | null = null
  
  constructor(existingInit?: AppwriteInit) {
    if (existingInit) {
      this.SignInOAuth = existingInit.SignInOAuth
      this._account = existingInit._account
      this._client = existingInit._client
      this._databases = existingInit._databases
      this.currentSession = existingInit.currentSession
      this.deleteSession = existingInit.deleteSession
      this.getCurrentSession = existingInit.getCurrentSession

      return
    }
    this._client.setEndpoint('https://cloud.appwrite.io/v1').setProject('6624061d15b9c848f5e1')
    this._databases = new Databases(this._client)
    this._account = new Account(this._client)
  }

  public get getClient() : Client {
    return this._client
  }

  public get getAllBoards(): Promise<Models.DocumentList<Models.Document>> {
    return this._databases.listDocuments(process.env['DATABASE_ID'] ?? ENV_NOT_SET, process.env['BOARDS_ID'] ?? ENV_NOT_SET)
  }
  
  public get getAllClips(): Promise<Models.DocumentList<Models.Document>> {
    return this._databases.listDocuments(process.env['DATABASE_ID'] ?? ENV_NOT_SET, process.env['CLIPS_ID'] ?? ENV_NOT_SET)
  }

  public SignInOAuth() {
    return this._account.createOAuth2Session(
      OAuthProvider.Google,
      'http://localhost:5000'
    )
  }
  
  private async getCurrentSession() {
    try {
      const response = await this._account.getSession('current')
      return this.currentSession = response
    } catch (reason) {
      console.log('Encountered an error. Trace: ', reason)
      this.currentSession = null
    }
  }

  public async deleteSession() {
    try {
      await this._account.deleteSession('current')
      return this.currentSession = null
    } catch (reason) {
      console.log('Encountered an error. Trace: ', reason)
    }
  }
}