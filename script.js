document.addEventListener("DOMContentLoaded", function () {
  const form = {
    currentStep: 1,
    progress: 0,
    isListenersRegistered: false,
    validEmail: false,

    formData: {
      state: "",
      city: "",
      guide_shop: "",
      name: "",
      email: "",
      tel: "",
      profession: "",
      privacyPolicy: true,
      marketingConsent: true,
      firstName: "",
      lastName: "",
      idLead: "",
      recordtypeDevName: "Expansao",
      company: "ABC",
      company2: "ABC Expansão",
      owner: "00GbJ0000062OFjUAM",
      canalDeEntrada: "Landing Page Expansão",
    },

    init: function () {
      if (this.isListenersRegistered) return;
      this.isListenersRegistered = true;

      const formContainer = document.querySelector(".forms");
      if (!formContainer) {
        console.error("Elemento .forms não encontrado.");
        return;
      }

      this.initializeProgressBar();
      this.setupEventListeners();
      this.setupInputListeners(formContainer);
    },

    setupEventListeners: function () {
      const backButtonStep2 = document.querySelector(".botao-voltar-Step2");
      const nextButtonStep1 = document.querySelector(
        ".botao-proxima-etapa-step1"
      );
      const nextButtonStep2 = document.querySelector(
        ".botao-proxima-etapa-step2"
      );
      const resetButton = document.querySelector(".botaoReset");
      const outrasGuideShopsButton = document.querySelector(
        ".botaoOutrasGuideShops"
      );
      const getState = document.querySelector(".state");

      if (backButtonStep2)
        backButtonStep2.addEventListener("click", () =>
          this.handlePreviousStep()
        );
      if (nextButtonStep1)
        nextButtonStep1.addEventListener("click", () => this.handleNextStep());
      if (nextButtonStep2)
        nextButtonStep2.addEventListener("click", () =>
          this.handleSubmitForm()
        );

      if (getState)
        getState.addEventListener("change", (e) => this.handleSelectState(e));

      if (resetButton) {
        resetButton.addEventListener("click", () => {
          this.resetForm();
        });
      }

      if (outrasGuideShopsButton) {
        outrasGuideShopsButton.addEventListener("click", () => {
          this.resetForm();
          // Se desejar implementar uma ação específica ao clicar em "Ver outras Guide Shops",
          // pode-se adicionar aqui, como abrir uma lista de lojas ou uma URL específica
          console.log("Buscando outras Guide Shops...");
        });
      }

      // Adicionar listener para o campo guide_shop
      const guideShopSelect = document.querySelector(".guide_shop");
      if (guideShopSelect) {
        guideShopSelect.addEventListener("change", () => {
          this.formData.guide_shop = guideShopSelect.value;
          this.updateStep1Progress();
        });
      }
    },

    setupInputListeners: function (formContainer) {
      formContainer.addEventListener("input", (event) => {
        const target = event.target;
        const field = target.name;

        if (
          [
            "state",
            "city",
            "guide_shop",
            "name",
            "lastname",
            "email",
            "tel",
            "profession",
          ].includes(field)
        ) {
          this.handleInputChange(event);
          if (field === "tel") this.validatePhoneInput(target);
          if (field === "email") this.validateEmail(target);
          if (this.currentStep === 1) this.updateStep1Progress();
          if (this.currentStep === 2) this.updateStep2Progress();
        }
      });

      formContainer.addEventListener("change", (event) => {
        const target = event.target;
        const field = target.name;

        if (
          [
            "state",
            "city",
            "guide_shop",
            "privacyPolicy",
            "marketingConsent",
          ].includes(field)
        ) {
          this.handleInputChange(event);
          if (this.currentStep === 1) this.updateStep1Progress();
          if (this.currentStep === 2) this.updateStep2Progress();
          if (this.currentStep === 3) this.verifyStep3Fields();
        }
      });

      // Adicionando eventos específicos para campos relevantes
      const nameInput = document.querySelector(".name");
      const lastnameInput = document.querySelector(".lastname");
      const emailInput = document.querySelector(".email");
      const telInput = document.querySelector(".tel");
      const privacyPolicyCheckbox = document.querySelector(".privacyPolicy");

      if (nameInput)
        nameInput.addEventListener("input", () => this.updateStep2Progress());
      if (lastnameInput)
        lastnameInput.addEventListener("input", () =>
          this.updateStep2Progress()
        );
      if (emailInput)
        emailInput.addEventListener("input", () => this.updateStep2Progress());
      if (telInput)
        telInput.addEventListener("input", () => this.updateStep2Progress());
      if (privacyPolicyCheckbox)
        privacyPolicyCheckbox.addEventListener("change", () =>
          this.updateStep2Progress()
        );

      if (this.currentStep === 3) this.verifyStep3Fields();
    },

    validatePhoneInput: function (input) {
      const numericValue = input.value.replace(/\D/g, "");
      if (numericValue.length > 11) {
        input.value = numericValue.slice(0, 11);
      }

      if (numericValue.length == 11) {
        if (input.classList.contains("invalid-input")) {
          input.classList.remove("invalid-input");
        }
      } else {
        input.classList.add("invalid-input");
      }

      const x = numericValue.match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
      input.value = !x[2]
        ? x[1]
        : `(${x[1]}) ${x[2]}` + (x[3] ? `-${x[3]}` : ``);
      this.formData.tel = numericValue;
    },

    validateEmail: function (input) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.validEmail = emailRegex.test(input.value);

      if (!this.validEmail) {
        input.classList.add("invalid-input");
      } else {
        if (input.classList.contains("invalid-input")) {
          input.classList.remove("invalid-input");
        }
      }
    },

    initializeProgressBar: function () {
      const progressBar = document.querySelector(".progress-bar");
      const progressPercent = document.querySelector(".progress-percent");

      if (progressBar) {
        progressBar.style.width = "0%";
        progressBar.style.backgroundColor = "";
      }

      if (progressPercent) {
        progressPercent.textContent = "0%";
      }
    },

    handleInputChange: function (event) {
      const field = event.target.name;
      const value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;
      this.formData[field] = value;

      if (this.currentStep === 1) this.updateStep1Progress();
      if (this.currentStep === 3) this.verifyStep3Fields();
    },

    updateStep1Progress: function () {
      const { state, city, guide_shop } = this.formData;

      const fields = [state, city, guide_shop];
      const filledFields = fields.filter(
        (field) => field && field.trim() !== ""
      ).length;

      if (filledFields > 0) {
        this.progress = (filledFields / fields.length) * 90;
      } else {
        this.progress = 0;
      }

      const nextButton = document.querySelector(".botao-proxima-etapa-step1");
      if (nextButton) {
        nextButton.disabled = filledFields < fields.length;
        nextButton.classList.toggle("selected", filledFields === fields.length);
      }

      this.updateProgress();
    },

    updateStep2Progress: function () {
      const { name, lastname, email, tel } = this.formData;

      // Verificar se o email é válido
      const emailInput = document.querySelector(".email");
      const isEmailValid =
        this.validEmail ||
        (emailInput &&
          emailInput.value &&
          !emailInput.classList.contains("invalid-input"));

      // Verificar se o telefone é válido (11 dígitos)
      const telInput = document.querySelector(".tel");
      const isTelValid =
        tel &&
        tel.length === 11 &&
        !telInput.classList.contains("invalid-input");

      // Verificar se os campos obrigatórios estão preenchidos
      const requiredFieldsFilled =
        name && lastname && email && tel && isEmailValid && isTelValid;

      // Verificar se os checkboxes estão marcados
      const privacyPolicyChecked =
        document.querySelector(".privacyPolicy").checked;

      // Atualizar o progresso
      if (requiredFieldsFilled) {
        this.progress = 90 + 5;
      } else {
        this.progress = 90;
      }

      // Atualizar o estado do botão
      const nextButton = document.querySelector(".botao-proxima-etapa-step2");
      if (nextButton) {
        nextButton.disabled = !(requiredFieldsFilled && privacyPolicyChecked);
        nextButton.classList.toggle(
          "selected",
          requiredFieldsFilled && privacyPolicyChecked
        );
      }

      this.updateProgress();
    },

    verifyStep3Fields: function () {
      const { privacyPolicy } = this.formData;

      const allFieldsFilled = privacyPolicy;

      const submitButton = document.querySelector(".botaoEnviar");
      if (submitButton) {
        submitButton.disabled = !allFieldsFilled;
        submitButton.classList.toggle("selected", allFieldsFilled);
      }

      if (allFieldsFilled) {
        this.progress = 95;
        this.updateProgress();
      }
    },

    finalizeProgressBar: function () {
      // Atualizar a barra de progresso existente
      this.progress = 100;
      this.updateProgress();

      // Mudar a cor para verde
      const progressBar = document.querySelector(".progress-bar");
      const progressPercent = document.querySelector(".progress-percent");

      if (progressBar) {
        progressBar.style.backgroundColor = "#00A859";
      }

      if (progressPercent) {
        progressPercent.style.color = "#00A859";
      }
    },

    resetForm: function () {
      this.currentStep = 1;
      this.progress = 0;
      this.validEmail = false;
      this.formData = {
        state: "",
        city: "",
        guide_shop: "",
        name: "",
        lastname: "",
        email: "",
        tel: "",
        profession: "",
        privacyPolicy: true,
        marketingConsent: true,
        firstName: "",
        lastName: "",
        idLead: "",
        recordtypeDevName: "Expansao",
        company: "ABC",
        company2: "ABC Expansão",
        owner: "00GbJ0000062OFjUAM",
        canalDeEntrada: "Landing Page Expansão",
      };

      // Resetar para a imagem normal
      this.toggleSuccessImages(false);

      // Remover classe que estiliza a barra de progresso
      document.body.classList.remove("formStep3-active");

      // Resetar a cor da barra de progresso para o padrão
      const progressBar = document.querySelector(".progress-bar");
      const progressPercent = document.querySelector(".progress-percent");

      if (progressBar) {
        progressBar.style.width = "0%";
        progressBar.style.backgroundColor = "#E3062D"; // Volta para a cor original (preta)
      }

      if (progressPercent) {
        progressPercent.textContent = "0%";
        progressPercent.style.color = ""; // Remove a cor personalizada
      }

      // Limpar todos os inputs
      const allInputs = document.querySelectorAll(
        'input:not([type="checkbox"])'
      );
      allInputs.forEach((input) => {
        input.value = "";
        input.classList.remove("invalid-input");
      });

      // Resetar selects
      const allSelects = document.querySelectorAll("select");
      allSelects.forEach((select) => {
        select.selectedIndex = 0;
      });

      // Limpar select de cidades
      const citySelect = document.querySelector(".city");
      if (citySelect) {
        citySelect.innerHTML =
          '<option value="" disabled selected>Selecione</option>';
      }

      // Limpar select de guide shops
      const guideShopSelect = document.querySelector(".guide_shop");
      if (guideShopSelect) {
        guideShopSelect.innerHTML =
          '<option value="" disabled selected>Selecione</option>';
      }

      // Atualizar checkboxes
      setTimeout(() => {
        this.updateAllCheckboxes();
        this.resetFields();
      }, 0);

      // Verificar botões
      const nextButtonStep1 = document.querySelector(
        ".botao-proxima-etapa-step1"
      );
      if (nextButtonStep1) {
        nextButtonStep1.disabled = true;
        nextButtonStep1.classList.remove("selected");
      }

      const nextButtonStep2 = document.querySelector(
        ".botao-proxima-etapa-step2"
      );
      if (nextButtonStep2) {
        nextButtonStep2.disabled = true;
        nextButtonStep2.classList.remove("selected");
      }

      this.updateVisibility();
      this.initializeProgressBar();
      console.log("Formulário completamente resetado.");
    },

    updateAllCheckboxes: function () {
      const privacyPolicyCheckbox = document.querySelector(
        "[name='privacyPolicy']"
      );
      const marketingConsentCheckbox = document.querySelector(
        "[name='marketingConsent']"
      );

      if (privacyPolicyCheckbox) {
        privacyPolicyCheckbox.checked = true;
      }
      if (marketingConsentCheckbox) {
        marketingConsentCheckbox.checked = true;
      }
    },

    resetFields: function () {
      const inputs = document.querySelectorAll("input, select");
      inputs.forEach((input) => {
        if (input.type === "checkbox") {
          input.checked = this.formData[input.name];
        } else {
          input.value = this.formData[input.name] || "";
        }
      });
    },

    handleNextStep: function () {
      if (this.currentStep < 2) {
        this.currentStep++;
        console.log(`Avançando para a etapa ${this.currentStep}`);
        this.updateVisibility();

        if (this.currentStep === 2) {
          this.progress = 90;
          this.updateProgress();
        }
      }
    },

    handlePreviousStep: function () {
      if (this.currentStep > 1) {
        this.currentStep--;
        console.log(`Voltando para a etapa ${this.currentStep}`);
        this.updateVisibility();

        if (this.currentStep === 1) {
          this.updateStep1Progress();
        } else if (this.currentStep === 2) {
          this.updateStep2Progress();
        }
      }
    },

    updateProgress: function (value = this.progress) {
      const progressBar = document.querySelector(".progress-bar");
      const progressPercent = document.querySelector(".progress-percent");

      if (progressBar) progressBar.style.width = `${value}%`;
      if (progressPercent)
        progressPercent.textContent = `${Math.round(value)}%`;
    },

    updateVisibility: function () {
      // Atualizar a visibilidade dos steps do formulário
      const steps = ["formStep1", "formStep2", "formStep3"];
      steps.forEach((stepClass, index) => {
        const step = document.querySelector(`.${stepClass}`);
        if (step) {
          step.style.display = this.currentStep === index + 1 ? "" : "none";
        }
      });

      // Atualizar a visibilidade dos títulos
      const titles = ["titleStep1", "titleStep2", "titleStep3"];
      titles.forEach((titleClass, index) => {
        const title = document.querySelector(`.${titleClass}`);
        if (title) {
          title.style.display = this.currentStep === index + 1 ? "" : "none";
        }
      });

      // Atualizar a visibilidade dos subtítulos
      const subtitles = ["subtitleStep1", "subtitleStep2", "subtitleStep3"];
      subtitles.forEach((subtitleClass, index) => {
        const subtitle = document.querySelector(`.${subtitleClass}`);
        if (subtitle) {
          subtitle.style.display = this.currentStep === index + 1 ? "" : "none";
        }
      });
    },

    handleSelectState: function (e) {
      let state = e.target.value.trim();
      this.formData.state = state;
      this.formData.city = "";
      this.formData.guide_shop = "";

      // Limpa o select de guide shop
      const guideShopSelect = document.querySelector(".guide_shop");
      if (guideShopSelect) {
        guideShopSelect.innerHTML =
          '<option value="" disabled selected>Selecione</option>';
      }

      this.updateStep1Progress();

      if (state) {
        // Simulando a chamada para API com cidades predefinidas
        const citiesByState = {
          SP: ["São Paulo", "Campinas", "Santos", "Ribeirão Preto"],
          RJ: ["Rio de Janeiro", "Niterói", "Duque de Caxias", "Nova Iguaçu"],
          MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora"],
          RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas"],
          // Adicione outros estados conforme necessário
        };

        const cities = citiesByState[state] || ["Cidade Principal"];
        const cityOptions = cities.map(
          (city) => `<option value="${city}">${city}</option>`
        );

        const citySelect = document.querySelector(".city");
        citySelect.innerHTML =
          '<option value="" disabled selected>Selecione</option>' +
          cityOptions.join("");

        // Adicionar listener para o campo de cidade
        citySelect.addEventListener("change", () => {
          this.formData.city = citySelect.value;

          // Quando a cidade é selecionada, carrega as guide shops
          if (citySelect.value) {
            this.loadGuideShops(state, citySelect.value);
          }

          this.updateStep1Progress();
        });
      }
    },

    loadGuideShops: function (state, city) {
      // Simulando a chamada para API com guide shops predefinidas
      const guideShopsByCity = {
        "São Paulo": [
          "ABC São Paulo - Centro",
          "ABC São Paulo - Zona Sul",
          "ABC São Paulo - Zona Leste",
        ],
        Campinas: ["ABC Campinas - Centro", "ABC Campinas - Barão Geraldo"],
        "Rio de Janeiro": [
          "ABC Rio - Centro",
          "ABC Rio - Zona Sul",
          "ABC Rio - Barra",
        ],
        "Belo Horizonte": ["ABC BH - Centro", "ABC BH - Pampulha"],
        "Porto Alegre": ["ABC POA - Centro", "ABC POA - Zona Sul"],
      };

      const defaultGuideShops = ["Guide Shop Central"];
      const guideShops = guideShopsByCity[city] || defaultGuideShops;
      const guideShopOptions = guideShops.map(
        (shop) => `<option value="${shop}">${shop}</option>`
      );

      const guideShopSelect = document.querySelector(".guide_shop");
      if (guideShopSelect) {
        guideShopSelect.innerHTML =
          '<option value="" disabled selected>Selecione</option>' +
          guideShopOptions.join("");
      }
    },

    handleSubmitForm: function () {
      // Processar os dados do formulário
      let name = this.formData.name;
      let firstName = name.split(" ")[0];
      let lastName =
        name.split(" ").length > 1
          ? name.replace(firstName, "").trim()
          : firstName.trim();
      let idLead = firstName.concat(
        lastName.replaceAll(" ", "").trim(),
        this.formData.tel.trim()
      );

      this.formData.idLead = idLead;
      this.formData.firstName = firstName;
      this.formData.lastName = this.formData.lastname || lastName;
      this.formData.marketingConsent =
        this.formData.marketingConsent.toString();
      this.formData.privacyPolicy = this.formData.privacyPolicy.toString();

      console.log("Dados que seriam enviados:", this.formData);

      // Avançar para a etapa de sucesso (etapa 3)
      this.currentStep = 3;
      this.updateVisibility();

      // Completar a barra de progresso
      this.finalizeProgressBar();

      // Trocar as imagens
      this.toggleSuccessImages(true);

      // Adicionar classe para estilizar a barra de progresso
      document.body.classList.add("formStep3-active");
    },

    toggleSuccessImages: function (showSuccess) {
      // Controlar qual imagem mostrar
      const regularImage = document.querySelector(".image-form");
      const successImage = document.querySelector(".check-form");

      if (regularImage && successImage) {
        regularImage.style.display = showSuccess ? "none" : "";
        successImage.style.display = showSuccess ? "" : "none";
      }
    },
  };

  // Implementar efeito sticky para o elemento .franquia-info
  const implementSticky = function () {
    const franquiaInfo = document.querySelector(".franquia-info");
    if (!franquiaInfo) return;

    // Verificar o tamanho da tela e aplicar comportamento adequado
    const checkScreenSize = function () {
      if (window.innerWidth > 1000) {
        // Em telas grandes, aplicar comportamento sticky via CSS
        // Remover estilos inline que possam interferir
        franquiaInfo.style.position = "";
        franquiaInfo.style.top = "";
        franquiaInfo.style.width = "";
      } else {
        // Em telas menores, garantir que não tenha posicionamento fixo
        franquiaInfo.style.position = "static";
        franquiaInfo.style.width = "100%";
        franquiaInfo.style.maxWidth = "100%";
        franquiaInfo.style.top = "auto";
      }
    };

    // Executar ao carregar e ao redimensionar
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
  };

  // Executar a função de sticky
  implementSticky();

  // Reajustar quando a janela for redimensionada
  window.addEventListener("resize", implementSticky);

  form.init();
});
