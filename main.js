
class AnimalFaceTest extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.model = null;
    this.webcam = null;
    this.maxPredictions = 0;
    this.isLoaded = false;
    this.isRunning = false;
  }

  connectedCallback() {
    this.render();
  }

  async init() {
    const startBtn = this.shadowRoot.querySelector('#start-btn');
    startBtn.disabled = true;
    startBtn.textContent = '모델 로딩 중...';

    const URL = "https://teachablemachine.withgoogle.com/models/4X94Avx3l/";
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
      this.model = await tmImage.load(modelURL, metadataURL);
      this.maxPredictions = this.model.getTotalClasses();

      const flip = true;
      this.webcam = new tmImage.Webcam(300, 300, flip);
      await this.webcam.setup();
      await this.webcam.play();
      
      this.isLoaded = true;
      this.isRunning = true;
      this.shadowRoot.querySelector('#webcam-container').appendChild(this.webcam.canvas);
      startBtn.style.display = 'none';
      
      window.requestAnimationFrame(() => this.loop());
    } catch (error) {
      console.error(error);
      alert('카메라 권한이 필요하거나 모델 로딩에 실패했습니다.');
      startBtn.disabled = false;
      startBtn.textContent = '다시 시도하기';
    }
  }

  async loop() {
    if (!this.isRunning) return;
    this.webcam.update();
    await this.predict();
    window.requestAnimationFrame(() => this.loop());
  }

  async predict() {
    const prediction = await this.model.predict(this.webcam.canvas);
    const labelContainer = this.shadowRoot.querySelector('#label-container');
    labelContainer.innerHTML = '';

    prediction.sort((a, b) => b.probability - a.probability);

    prediction.forEach(p => {
      const percentage = (p.probability * 100).toFixed(0);
      const row = document.createElement('div');
      row.className = 'prediction-row';
      
      let emoji = '❓';
      if(p.className.includes('강아지')) emoji = '🐶';
      if(p.className.includes('고양이')) emoji = '🐱';
      if(p.className.includes('고릴라')) emoji = '🦍';

      row.innerHTML = `
        <div class="label-info">
          <span>${emoji} ${p.className}</span>
          <span>${percentage}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>
      `;
      labelContainer.appendChild(row);
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }
        .card {
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 15px 35px var(--shadow-color, rgba(0,0,0,0.1));
          text-align: center;
        }
        #webcam-container {
          margin: 20px auto;
          width: 300px;
          height: 300px;
          border-radius: 15px;
          overflow: hidden;
          background: #f0f2f5;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid var(--primary-color, #4a90e2);
        }
        canvas {
          width: 100% !important;
          height: 100% !important;
        }
        #start-btn {
          background: var(--primary-color, #4a90e2);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
        }
        #start-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(74, 144, 226, 0.4);
          background: #357abd;
        }
        #start-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          box-shadow: none;
        }
        #label-container {
          margin-top: 25px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .prediction-row {
          text-align: left;
        }
        .label-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-weight: 600;
          font-size: 0.95rem;
          color: #444;
        }
        .progress-bar {
          background: #eee;
          height: 12px;
          border-radius: 6px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-color) 0%, #357abd 100%);
          transition: width 0.2s ease;
        }
      </style>
      <div class="card">
        <div id="webcam-container">
          <span style="color: #888;">카메라 화면이 여기에 표시됩니다</span>
        </div>
        <button id="start-btn">테스트 시작하기</button>
        <div id="label-container"></div>
      </div>
    `;

    this.shadowRoot.querySelector('#start-btn').addEventListener('click', () => this.init());
  }
}

customElements.define('animal-face-test', AnimalFaceTest);

class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'lotto-card');

    const title = document.createElement('h1');
    title.textContent = '로또 번호 생성기';

    const numbersContainer = document.createElement('div');
    numbersContainer.setAttribute('class', 'numbers-container');

    const button = document.createElement('button');
    button.textContent = '번호 생성하기';
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
      <h2>제휴 문의</h2>
      <p>협업에 관심이 있으신가요? 아래 폼을 작성해 주세요!</p>
      <form action="https://formspree.io/f/xkovkyol" method="POST">
        <div class="field">
          <label for="name">이름</label>
          <input type="text" id="name" name="name" placeholder="성함을 입력해 주세요" required>
        </div>
        <div class="field">
          <label for="email">이메일</label>
          <input type="email" id="email" name="_replyto" placeholder="이메일 주소를 입력해 주세요" required>
        </div>
        <div class="field">
          <label for="message">메시지</label>
          <textarea id="message" name="message" placeholder="문의 내용을 입력해 주세요..." rows="4" required></textarea>
        </div>
        <button type="submit">문의 보내기</button>
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
