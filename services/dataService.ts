
import { User, InterestRate, GlobalConfig, Transaction, Loan, UserRole } from '../types';

/**
 * DataService: Realiza llamadas fetch a los scripts PHP.
 * El backend PHP debe actuar como proxy para la base de datos Informix.
 */
export class DataService {
  private static API_URL = 'api'; 

  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.API_URL}/${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      if (!response.ok) throw new Error(`Error en API: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error(`Error llamando a ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * login: Procesa la respuesta JSON técnica del backend
   */
  static async login(id: string, pin: string): Promise<User | null> {
    const rawResponse = await this.request<any>('auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ id, pin })
    });

    if (!rawResponse) return null;

    // Aquí mapeamos el JSON técnico que mostraste a nuestro objeto User
    return {
      id: rawResponse.usuaNomUsua || rawResponse.id || '',
      name: rawResponse.name || rawResponse.usuaNomUsua || 'Usuario Core',
      pin: rawResponse.usuaPasswd || rawResponse.pin || '',
      role: (rawResponse.usuaCodPerf === 'SUPERADMIN' ? UserRole.ADMIN : UserRole.MEMBER),
      
      // Preservamos los campos técnicos por si se necesitan
      usuaCodEmpl: rawResponse.usuaCodEmpl,
      usuaCodPerf: rawResponse.usuaCodPerf,
      usuaNomUsua: rawResponse.usuaNomUsua,
      usuaPasswd: rawResponse.usuaPasswd,
      usuaFecUac: rawResponse.usuaFecUac,
      usuaNumAgen: rawResponse.usuaNumAgen,
      usuaBanUsua: rawResponse.usuaBanUsua,
      usuaImpPred: rawResponse.usuaImpPred,
      
      accounts: rawResponse.accounts || [],
      transactions: rawResponse.transactions || [],
      loans: rawResponse.loans || []
    } as User;
  }

  static async getUserFullData(userId: string): Promise<User> {
    return this.request<User>(`users/get_profile.php?id=${userId}`);
  }

  static async getFinancialReport(type: string, params: any): Promise<any[]> {
    return this.request<any[]>('reports/generate.php', {
      method: 'POST',
      body: JSON.stringify({ type, ...params })
    });
  }

  static async getUsers(): Promise<User[]> {
    const saved = localStorage.getItem('cap_core_users');
    return saved ? JSON.parse(saved) : [];
  }

  static async saveUsers(users: User[]): Promise<void> {
    localStorage.setItem('cap_core_users', JSON.stringify(users));
  }

  static async getRates(): Promise<InterestRate[]> {
    const saved = localStorage.getItem('cap_interest_rates');
    return saved ? JSON.parse(saved) : [];
  }

  static async getConfig(): Promise<GlobalConfig> {
    const saved = localStorage.getItem('cap_global_config');
    return saved ? JSON.parse(saved) : {} as GlobalConfig;
  }
}
