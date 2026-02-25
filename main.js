
class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'lotto-card');

    const title = document.createElement('h1');
    title.textContent = 'Lotto Number Generator';

    const numbersContainer = document.createElement('div');
    numbersContainer.setAttribute('class', 'numbers-container');

    const button = document.createElement('button');
    button.textContent = 'Generate Numbers';
    button.addEventListener('click', () => this.generateAndDisplayNumbers());

    const style = document.createElement('style');
    style.textContent = `
      .lotto-card {
        background-color: var(--card-background-color);
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 10px 20px var(--shadow-color);
        text-align: center;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .lotto-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px var(--shadow-color);
      }
      h1 {
        color: var(--primary-color);
        margin-bottom: 20px;
      }
      .numbers-container {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 30px;
      }
      .number {
        width: 50px;
        height: 50px;
        background-color: var(--primary-color);
        color: white;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.5em;
        font-weight: bold;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        transition: transform 0.2s ease;
      }
      .number:hover {
        transform: scale(1.1);
      }
      button {
        background-color: var(--primary-color);
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 25px;
        font-size: 1em;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      }
      button:hover {
        background-color: #357ABD;
        transform: translateY(-2px);
      }
      button:active {
        transform: translateY(1px);
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(title);
    wrapper.appendChild(numbersContainer);
    wrapper.appendChild(button);

    this.numbersContainer = numbersContainer;
    this.generateAndDisplayNumbers();
  }

  generateNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
      const randomNumber = Math.floor(Math.random() * 45) + 1;
      numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  }

  displayNumbers(numbers) {
    this.numbersContainer.innerHTML = '';
    for (const number of numbers) {
      const numberElement = document.createElement('div');
      numberElement.setAttribute('class', 'number');
      numberElement.textContent = number;
      this.numbersContainer.appendChild(numberElement);
    }
  }

  generateAndDisplayNumbers() {
    const numbers = this.generateNumbers();
    this.displayNumbers(numbers);
  }
}

class AffiliateForm extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const container = document.createElement('div');
    container.setAttribute('class', 'form-container');

    container.innerHTML = `
      <h2>Partnership Inquiry</h2>
      <p>Interested in collaborating? Fill out the form below!</p>
      <form action="https://formspree.io/f/xkovkyol" method="POST">
        <div class="field">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" placeholder="Your Full Name" required>
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input type="email" id="email" name="_replyto" placeholder="your@email.com" required>
        </div>
        <div class="field">
          <label for="message">Message</label>
          <textarea id="message" name="message" placeholder="Tell us about your proposal..." rows="4" required></textarea>
        </div>
        <button type="submit">Send Inquiry</button>
      </form>
    `;

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        margin-top: 40px;
        width: 100%;
        max-width: 500px;
      }
      .form-container {
        background: var(--card-background-color, #ffffff);
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 20px 40px var(--shadow-color, rgba(0,0,0,0.1));
        border: 1px solid rgba(0,0,0,0.05);
      }
      h2 {
        margin-top: 0;
        color: var(--primary-color, #4a90e2);
        font-size: 1.8rem;
        margin-bottom: 8px;
      }
      p {
        color: #666;
        margin-bottom: 24px;
        font-size: 0.95rem;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 8px;
        text-align: left;
      }
      label {
        font-weight: 600;
        font-size: 0.9rem;
        color: #444;
      }
      input, textarea {
        padding: 12px 16px;
        border: 2px solid #eee;
        border-radius: 12px;
        font-size: 1rem;
        font-family: inherit;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }
      input:focus, textarea:focus {
        outline: none;
        border-color: var(--primary-color, #4a90e2);
        box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.1);
      }
      button {
        background-color: var(--primary-color, #4a90e2);
        color: white;
        border: none;
        padding: 16px;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 10px;
        box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
      }
      button:hover {
        background-color: #357abd;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(74, 144, 226, 0.4);
      }
      button:active {
        transform: translateY(0);
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(container);
  }
}

customElements.define('lotto-generator', LottoGenerator);
customElements.define('affiliate-form', AffiliateForm);
