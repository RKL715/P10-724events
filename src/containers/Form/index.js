import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () => new Promise((resolve) => { setTimeout(resolve, 500); })

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);


  const validateForm = (formElement) => {
    const formData = new FormData(formElement);
    const data = Object.fromEntries(formData);
    return !(!data.lastName || !data.firstName || !data.type || !data.email || !data.message);

  }

  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();
      const isValid = validateForm(evt.target);
      if (!isValid) {
        return; // empêche l'envoi du formulaire si les champs ne sont pas remplis
      }
      setSending(true);
      // We try to call mockContactApi
      try {
        await mockContactApi();
        setSending(false);
        onSuccess(); // PROBLEM 1
      } catch (err) {
        setSending(false);
        onError(err);
      }
    },
    [onSuccess, onError]
  );
  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field
              placeholder=""
              label="Nom"
              name="lastName"
              required
          />
          <Field
              placeholder=""
              label="Prénom"
              name="firstName"
              required
          />
          <Select
            selection={["Personel", "Entreprise"]}
            onChange={() => null}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
            name="type"
            required
          />
          <Field
              placeholder=""
              label="Email"
              name="email"
              required
          />
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          <Field
            placeholder="message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
            name="message"
            required
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
}

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
}

export default Form;


// 1. LINE 19 : Success message does not appear when the form is submitted : Added onSuccess() to call the function when the form is submitted
// 2. LINE  7 : Test : "When Events is created > and a click is triggered on the submit button > the success action is called" was failing. By changing the timeout of the mockContactApi to 500ms, the test passed.