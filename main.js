
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

customElements.define('lotto-generator', LottoGenerator);
