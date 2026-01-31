import { User } from '../../../types/user';

export class UserBuilder {
  private user: User;

  /**
   * Initializes a new User with default values
   */
  constructor() {
    this.user = {
      id: Date.now(),
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      userStatus: 1
    };
  }

  /**
   * Sets a custom username
   */
  withUsername(username: string) {
    this.user.username = username;
    return this;
  }

  /**
   * Generates a random username
   */
  withRandomUsername() {
    this.user.username = 'user_' + this.user.id;
    return this;
  }

  /**
   * Sets a custom first name
   */
  withFirstName(firstName: string) {
    this.user.firstName = firstName;
    return this;
  }

  /**
   * Generates a random first name
   */
  withRandomFirstName() {
    this.user.firstName = 'First_' + this.user.id;
    return this;
  }

  /**
   * Sets a custom last name
   */
  withLastName(lastName: string) {
    this.user.lastName = lastName;
    return this;
  }

  /**
   * Generates a random last name
   */
  withRandomLastName() {
    this.user.lastName = 'Last_' + this.user.id;
    return this;
  }

  /**
   * Sets a custom email
   */
  withEmail(email: string) {
    this.user.email = email;
    return this;
  }

  /**
   * Generates a random email
   */
  withRandomEmail() {
    this.user.email = `user${this.user.id}@example.com`;
    return this;
  }

  /**
   * Sets a custom password
   */
  withPassword(password: string) {
    this.user.password = password;
    return this;
  }

  /**
   * Generates a random password
   */
  withRandomPassword() {
    this.user.password = 'password123';
    return this;
  }

  /**
   * Sets a custom phone number
   */
  withPhone(phone: string) {
    this.user.phone = phone;
    return this;
  }

  /**
   * Generates a random phone number
   */
  withRandomPhone() {
    this.user.phone = '1234567890';
    return this;
  }

  /**
   * Sets user status
   */
  withUserStatus(status: number) {
    this.user.userStatus = status;
    return this;
  }

  /**
   * Returns the constructed user object
   */
  build() {
    return this.user;
  }
}