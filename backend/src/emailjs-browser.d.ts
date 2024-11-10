declare module '@emailjs/browser' {
    export function send(
      serviceID: string,
      templateID: string,
      templateParams: object,
      userID: string
    ): Promise<{ text: string }>;
  
    export function sendForm(
      serviceID: string,
      templateID: string,
      form: HTMLFormElement,
      userID: string
    ): Promise<{ text: string }>;
  }
  