class AnimalFaceTest extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.model = null;
    this.maxPredictions = 0;
    this.isModelLoaded = false;
  }

  connectedCallback() {
    this.render();
    this.loadModel();
  }

  async loadModel() {
    const URL = "https://teachablemachine.withgoogle.com/models/4X94Avx3l/";
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
      this.model = await tmImage.load(modelURL, metadataURL);
      this.maxPredictions = this.model.getTotalClasses();
      this.isModelLoaded = true;
      console.log("Model Loaded");
    } catch (e) {
      console.error("Model Load Error:", e);
    }
  }

  async handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!this.isModelLoaded) {
      alert("모델이 아직 로딩 중입니다. 잠시만 기다려 주세요.");
      return;
    }

    const preview = this.shadowRoot.querySelector('#image-preview');
    const loadingText = this.shadowRoot.querySelector('#loading-text');
    const placeholder = this.shadowRoot.querySelector('.placeholder-text');
    const retryBtn = this.shadowRoot.querySelector('#retry-btn');

    const reader = new FileReader();
    reader.onload = (e) => {
      preview.onload = async () => {
        loadingText.textContent = '분석 중...';
        await this.predict(preview);
        loadingText.textContent = '분석 완료!';
        retryBtn.style.display = 'inline-block';
      };
      preview.src = e.target.result;
      preview.style.display = 'block';
      placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  reset() {
    const preview = this.shadowRoot.querySelector('#image-preview');
    const labelContainer = this.shadowRoot.querySelector('#label-container');
    const loadingText = this.shadowRoot.querySelector('#loading-text');
    const placeholder = this.shadowRoot.querySelector('.placeholder-text');
    const retryBtn = this.shadowRoot.querySelector('#retry-btn');
    const fileInput = this.shadowRoot.querySelector('#file-input');

    preview.src = '#';
    preview.style.display = 'none';
    placeholder.style.display = 'flex';
    labelContainer.innerHTML = '';
    loadingText.textContent = '';
    retryBtn.style.display = 'none';
    fileInput.value = '';
  }

  async predict(imageElement) {
    const prediction = await this.model.predict(imageElement);
    const labelContainer = this.shadowRoot.querySelector('#label-container');
    labelContainer.innerHTML = '';

    prediction.sort((a, b) => b.probability - a.probability);

    prediction.forEach(p => {
      const percentage = (p.probability * 100).toFixed(0);
      const row = document.createElement('div');
      row.className = 'prediction-row';
      
      let emoji = '❓';
      const className = p.className.toLowerCase();
      if(className.includes('강아지') || className.includes('dog')) emoji = '🐶';
      else if(className.includes('고양이') || className.includes('cat')) emoji = '🐱';
      else if(className.includes('고릴라') || className.includes('gorilla')) emoji = '🦍';

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
        .upload-section {
          margin: 20px auto;
          width: 100%;
          height: 300px;
          border-radius: 15px;
          overflow: hidden;
          background: #f8f9fa;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px dashed #cbd5e0;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }
        .upload-section:hover {
          border-color: var(--primary-color);
          background: #f0f7ff;
        }
        #image-preview {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: none;
        }
        .placeholder-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #718096;
          font-size: 0.9rem;
        }
        #file-input {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        #loading-text {
          margin-top: 15px;
          font-weight: 600;
          color: var(--primary-color);
          min-height: 1.2rem;
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
          transition: width 0.5s ease-out;
        }
        #retry-btn {
          display: none;
          margin-top: 20px;
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }
        #retry-btn:hover {
          background: #357abd;
        }
      </style>
      <div class="card">
        <div class="upload-section">
          <img id="image-preview" src="#" alt="Preview">
          <div class="placeholder-text">
            <span style="font-size: 3rem; display: block; margin-bottom: 10px;">📸</span>
            <span>클릭하여 사진을 업로드하거나 찍으세요</span>
          </div>
          <input type="file" id="file-input" accept="image/*">
        </div>
        <div id="loading-text"></div>
        <div id="label-container"></div>
        <button id="retry-btn">다른 사진으로 다시 하기</button>
      </div>
    `;

    this.shadowRoot.querySelector('#file-input').addEventListener('change', (e) => this.handleFileUpload(e));
    this.shadowRoot.querySelector('#retry-btn').addEventListener('click', () => this.reset());
  }
}

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

customElements.define('animal-face-test', AnimalFaceTest);
customElements.define('lotto-generator', LottoGenerator);
customElements.define('affiliate-form', AffiliateForm);

// Privacy Policy Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('privacy-modal');
    const privacyLinks = document.querySelectorAll('a[href="#privacy"]');
    const closeBtn = document.querySelector('.close-btn');

    if (modal && closeBtn) {
        privacyLinks.forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                modal.style.display = "block";
            };
        });

        closeBtn.onclick = () => {
            modal.style.display = "none";
        };

        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    }
});
