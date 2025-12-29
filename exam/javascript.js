$(function () {
  $(".error").hide();
  const today = new Date().toISOString().split("T")[0];
  $("#valuationDate").val(today);

  function validateField(fieldId, errorId, validationFn) {
    const value = $(fieldId).val().trim();
    const $field = $(fieldId);
    const $error = $(errorId);

    $error.hide();
    $field.removeClass("invalid valid");

    const { isValid, message } = validationFn(value);

    if (!isValid) {
      $error.text(message).show();
      $field.addClass("invalid");
      return false;
    } else {
      $field.addClass("valid");
      return true;
    }
  }

  const validationRules = {
    "#objectName": function (value) {
      if (!value.trim()) {
        return { isValid: false, message: "Название объекта обязательно" };
      }
      if (value.length < 2) {
        return {
          isValid: false,
          message: "Название не должно быть меньше 2 символов",
        };
      }
      if (value.length > 100) {
        return {
          isValid: false,
          message: "Название не должно быть больше 100 символов",
        };
      }
      if (!/^[а-яА-ЯёЁa-zA-Z0-9\s]+$/.test(value)) {
        return {
          isValid: false,
          message: "Название содержит запрещенные символы",
        };
      }
      return { isValid: true, message: "" };
    },

    "#objectType": function (value) {
      if (!value) return { isValid: false, message: "Выберите тип объекта" };
      return { isValid: true, message: "" };
    },

    "#address": function (value) {
      if (!value.trim()) {
        return { isValid: false, message: "Адрес объекта обязателен" };
      }
      if (value.length < 10) {
        return {
          isValid: false,
          message: "Адрес не должен быть меньше 10 символов",
        };
      }
      if (value.length > 500) {
        return {
          isValid: false,
          message: "Адрес не должен быть больше 500 символов",
        };
      }

      if (!/^[а-яА-ЯёЁa-zA-Z0-9\s\.,\-/()'"№]+$/.test(value)) {
        return {
          isValid: false,
          message: "Адрес содержит запрещенные символы",
        };
      }

      return { isValid: true, message: "" };
    },
    "#area": function (value) {
      if (!value || value.trim() === "") return { isValid: true, message: "" };
      const num = parseInt(value);
      if (isNaN(num)) return { isValid: false, message: "Введите число" };
      if (num < 1)
        return { isValid: false, message: "Площадь должна быть не менее 1 м²" };
      if (num > 10000)
        return {
          isValid: false,
          message: "Площадь не может превышать 10000 м²",
        };
      return { isValid: true, message: "" };
    },

    "#ownerName": function (value) {
      if (!value.trim()) {
        return { isValid: false, message: "ФИО владельца обязательно" };
      }
      if (value.length < 5)
        return { isValid: false, message: "ФИО владельца слишком короткое" };
      if (value.length > 100)
        return { isValid: false, message: "ФИО владельца слишком длинное" };

      if (!/^[а-яА-ЯёЁ\s]+$/.test(value))
        return {
          isValid: false,
          message: "ФИО должно содержать только русские буквы и пробелы",
        };
      return { isValid: true, message: "" };
    },

    "#ownerEmail": function (value) {
      if (!value.trim()) {
        return { isValid: false, message: "Email владельца обязателен" };
      }
      if (value.length < 5)
        return { isValid: false, message: "Email слишком короткий" };
      if (value.length > 100)
        return { isValid: false, message: "Email слишком длинный" };

      const emailRegex = /^[a-zA-Z0-9._-]+@[a-z]+\.[a-z]{2,}$/;
      if (!emailRegex.test(value))
        return { isValid: false, message: "Email введен неверно" };

      return { isValid: true, message: "" };
    },

    "#ownerINN": function (value) {
      if (!value.trim()) return { isValid: false, message: "ИНН обязателен" };

      const innDigits = value.replace(/\D/g, "");
      const ownerType = $("input[name='ownerType']:checked").val();

      if (!ownerType) {
        return { isValid: false, message: "Выберите тип владельца" };
      }

      if (ownerType === "individual") {
        if (!/^\d{12}$/.test(innDigits)) {
          return {
            isValid: false,
            message: "ИНН физ.лица должен содержать 12 цифр",
          };
        }
      } else if (ownerType === "legal") {
        if (!/^\d{10}$/.test(innDigits)) {
          return {
            isValid: false,
            message: "ИНН юр.лица должен содержать 10 цифр",
          };
        }
      }

      return { isValid: true, message: "" };
    },

    "#valuationAmount": function (value) {
      if (!value.trim()) {
        return {
          isValid: false,
          message: "Оценочная стоимость обязательна",
        };
      }
      const num = parseFloat(value);
      if (isNaN(num))
        return { isValid: false, message: "Стоимость должна быть числом" };
      if (num < 0)
        return {
          isValid: false,
          message: "Стоимость не может быть отрицательной",
        };
      if (num > 1000000000000)
        return { isValid: false, message: "Стоимость слишком большая" };
      return { isValid: true, message: "" };
    },

    "#ownerPhone": function (value) {
      if (!value.trim())
        return { isValid: false, message: "Телефон обязателен" };

      const cleanValue = value.replace(/[^\d+]/g, "");

      // Проверяем формат: +7 и ровно 10 цифр после
      if (!/^\+7\d{10}$/.test(cleanValue)) {
        return {
          isValid: false,
          message:
            "Введите номер в формате: +7XXXXXXXXXX (11 цифр с кодом страны)",
        };
      }

      return { isValid: true, message: "" };
    },

    "#cadastralNumber": function (value) {
      if (!value.trim()) {
        return { isValid: false, message: "Кадастровый номер обязателен" };
      }

      // Убираем лишние пробелы
      value = value.trim();

      // Минимальная длина с разделителями: 2:2:6:1 = 11 символов
      // Максимальная: 2:2:7:4 = 15 символов
      if (value.length < 11 || value.length > 15) {
        return {
          isValid: false,
          message: "Кадастровый номер должен быть от 11 до 15 символов",
        };
      }

      // Проверяем количество двоеточий
      const colonCount = (value.match(/:/g) || []).length;
      if (colonCount !== 3) {
        return {
          isValid: false,
          message: "Должно быть ровно 3 двоеточия (формат: XX:XX:XXXXXX:XXX)",
        };
      }

      // Разбиваем на части
      const parts = value.split(":");

      if (parts.length !== 4) {
        return {
          isValid: false,
          message: "Неправильный формат. Должно быть: XX:XX:XXXXXX:XXX",
        };
      }

      // Проверяем каждую часть
      const [part1, part2, part3, part4] = parts;

      if (!/^\d{2}$/.test(part1)) {
        return { isValid: false, message: "Первая часть: 2 цифры" };
      }

      if (!/^\d{2}$/.test(part2)) {
        return { isValid: false, message: "Вторая часть: 2 цифры" };
      }

      if (!/^\d{6,7}$/.test(part3)) {
        return { isValid: false, message: "Третья часть: 6 или 7 цифр" };
      }

      if (!/^\d{1,4}$/.test(part4)) {
        return { isValid: false, message: "Четвертая часть: от 1 до 4 цифр" };
      }

      return { isValid: true, message: "" };
    },
  };

  function validateAllFields() {
    let isFormValid = true;

    Object.keys(validationRules).forEach(function (fieldSelector) {
      const validator = validationRules[fieldSelector];
      const errorId = fieldSelector + "Error";

      if (!validateField(fieldSelector, errorId, validator)) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  // Обработчик для всех полей ввода
  $("input, select, textarea").on("input change", function () {
    const fieldId = "#" + $(this).attr("id");
    const errorId = fieldId + "Error";
    const validator = validationRules[fieldId];
    if (validator) {
      validateField(fieldId, errorId, validator);
    }
  });

  // Обработчик для типа владельца
  $("input[name='ownerType']").change(function () {
    validateField("#ownerINN", "#ownerINNError", validationRules["#ownerINN"]);
  });

  function getFormData() {
    const formData = {
      objectName: $("#objectName").val().trim(),
      objectType: $("#objectType").val(),
      address: $("#address").val().trim(),
      area: $("#area").val(),
      status: $("input[name='status']:checked").val(),

      ownerName: $("#ownerName").val().trim(),
      ownerPhone: $("#ownerPhone").val().trim(),
      ownerEmail: $("#ownerEmail").val().trim(),
      ownerINN: $("#ownerINN").val().trim(),
      ownerType: $("input[name='ownerType']:checked").val(),

      cadastralNumber: $("#cadastralNumber").val().trim(),
      propertyRights: $("#propertyRights").val(),

      specialMarks: [],
      valuationDate: $("#valuationDate").val(),
      valuationAmount: $("#valuationAmount").val(),

      savedAt: new Date().toISOString(),
    };

    $("input[type='checkbox']:checked").each(function () {
      formData.specialMarks.push($(this).val());
    });

    return formData;
  }

  $("#saveBtn").click(function (e) {
    e.preventDefault();
    if (!confirm("Вы уверены, что хотите сохранить файл?")) {
      return;
    }
    
    if (!validateAllFields()) {
      alert("Пожалуйста, исправьте ошибки в форме");
      $(".invalid").first().focus();
      return;
    }

    const formData = getFormData();
    const jsonData = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonData], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    const filename = formData.objectName
      ? `недвижимость_${formData.objectName.replace(/[<>:"/\\|?*]/g, "_")}.json`
      : `недвижимость_${Date.now()}.json`;
    a.href = url;
    a.download = filename;
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    $("#successMessage")
      .text(`Данные сохранены в файл: ${filename}`)
      .fadeIn()
      .delay(10000)
      .fadeOut();
  });

  $("#clearBtn").click(function () {
    if (!confirm("Вы уверены, что хотите очистить все поля формы?")) {
      return;
    }

    $(
      'input[type="text"], input[type="number"], input[type="date"], input[type="email"], textarea'
    ).val("");

    $("select").prop("selectedIndex", 0);
    $("#statusActive").prop("checked", true);
    $("#ownerIndividual").prop("checked", true);
    $('input[type="checkbox"]').prop("checked", false);
    $("#valuationDate").val(today);
    $("input, select, textarea").removeClass("invalid valid");
    $(".error").hide();
    $("#successMessage").hide();
    $("#objectName").focus();
  });
});
