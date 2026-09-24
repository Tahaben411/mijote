import { useMemo, useState, type FormEvent } from 'react';
import { createRecipe } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Difficulty } from '../types/Recipe';

interface FormValues {
  name: string;
  cuisine: string;
  difficulty: Difficulty;
  prepTimeMinutes: string;
  servings: string;
  ingredients: string;
  instructions: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;
type TouchedFields = Partial<Record<keyof FormValues, boolean>>;

const initialValues: FormValues = {
  name: '',
  cuisine: '',
  difficulty: 'Easy',
  prepTimeMinutes: '20',
  servings: '4',
  ingredients: '',
  instructions: '',
};

function nonEmptyLines(value: string) {
  return value.split('\n').map((line) => line.trim()).filter(Boolean);
}

export function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const trimmedName = values.name.trim();
  if (trimmedName.length < 3 || trimmedName.length > 60) {
    errors.name = 'Le nom doit contenir entre 3 et 60 caractères.';
  }
  if (!values.cuisine.trim()) errors.cuisine = 'La cuisine est obligatoire.';

  const prep = Number(values.prepTimeMinutes);
  if (!Number.isInteger(prep) || prep < 1 || prep > 240) {
    errors.prepTimeMinutes = 'Saisissez un entier entre 1 et 240.';
  }

  const servings = Number(values.servings);
  if (!Number.isInteger(servings) || servings < 1 || servings > 12) {
    errors.servings = 'Saisissez un entier entre 1 et 12.';
  }

  if (nonEmptyLines(values.ingredients).length < 2) {
    errors.ingredients = 'Ajoutez au moins 2 ingrédients, un par ligne.';
  }
  if (nonEmptyLines(values.instructions).length < 1) {
    errors.instructions = 'Ajoutez au moins 1 étape.';
  }
  return errors;
}

export default function NewRecipePage() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [touched, setTouched] = useState<TouchedFields>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const { user } = useAuth();
  const errors = useMemo(() => validate(values), [values]);
  const isValid = Object.keys(errors).length === 0;

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function errorFor(field: keyof FormValues) {
    return (touched[field] || submitted) ? errors[field] : undefined;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid || !user) return;

    setSubmitting(true);
    setSuccess('');
    setSubmitError('');
    try {
      const created = await createRecipe({
        name: values.name.trim(),
        cuisine: values.cuisine.trim(),
        difficulty: values.difficulty,
        prepTimeMinutes: Number(values.prepTimeMinutes),
        servings: Number(values.servings),
        ingredients: nonEmptyLines(values.ingredients),
        instructions: nonEmptyLines(values.instructions),
        userId: user.id,
      });
      setSuccess(`Recette envoyée avec succès. Identifiant reçu : ${created.id}.`);
      setValues(initialValues);
      setTouched({});
      setSubmitted(false);
    } catch {
      setSubmitError("L'envoi a échoué. Votre saisie a été conservée.");
    } finally {
      setSubmitting(false);
    }
  }

  const fieldErrorProps = (field: keyof FormValues) => {
    const message = errorFor(field);
    return {
      'aria-invalid': Boolean(message),
      'aria-describedby': message ? `${field}-error` : undefined,
      className: message ? 'invalid' : undefined,
    };
  };

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Partagez votre idée</p>
          <h1>Proposer une recette</h1>
        </div>
      </div>

      <form className="form-card recipe-form" onSubmit={handleSubmit} noValidate>
        {success && <div className="success-message" role="status">{success}</div>}
        {submitError && <div className="inline-error" role="alert">{submitError}</div>}

        <div className="form-grid">
          <label className="field stacked-field span-2">
            <span>Nom de la recette</span>
            <input
              value={values.name}
              onChange={(e) => setField('name', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              {...fieldErrorProps('name')}
            />
            {errorFor('name') && <small id="name-error" className="field-error">{errorFor('name')}</small>}
          </label>

          <label className="field stacked-field">
            <span>Cuisine</span>
            <input
              value={values.cuisine}
              onChange={(e) => setField('cuisine', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, cuisine: true }))}
              {...fieldErrorProps('cuisine')}
            />
            {errorFor('cuisine') && <small id="cuisine-error" className="field-error">{errorFor('cuisine')}</small>}
          </label>

          <label className="field stacked-field">
            <span>Difficulté</span>
            <select value={values.difficulty} onChange={(e) => setField('difficulty', e.target.value as Difficulty)}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>

          <label className="field stacked-field">
            <span>Préparation (min)</span>
            <input
              type="number" min="1" max="240"
              value={values.prepTimeMinutes}
              onChange={(e) => setField('prepTimeMinutes', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, prepTimeMinutes: true }))}
              {...fieldErrorProps('prepTimeMinutes')}
            />
            {errorFor('prepTimeMinutes') && <small id="prepTimeMinutes-error" className="field-error">{errorFor('prepTimeMinutes')}</small>}
          </label>

          <label className="field stacked-field">
            <span>Portions</span>
            <input
              type="number" min="1" max="12"
              value={values.servings}
              onChange={(e) => setField('servings', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, servings: true }))}
              {...fieldErrorProps('servings')}
            />
            {errorFor('servings') && <small id="servings-error" className="field-error">{errorFor('servings')}</small>}
          </label>

          <label className="field stacked-field span-2">
            <span>Ingrédients — un par ligne</span>
            <textarea
              rows={6}
              value={values.ingredients}
              onChange={(e) => setField('ingredients', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, ingredients: true }))}
              {...fieldErrorProps('ingredients')}
            />
            {errorFor('ingredients') && <small id="ingredients-error" className="field-error">{errorFor('ingredients')}</small>}
          </label>

          <label className="field stacked-field span-2">
            <span>Étapes — une par ligne</span>
            <textarea
              rows={7}
              value={values.instructions}
              onChange={(e) => setField('instructions', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, instructions: true }))}
              {...fieldErrorProps('instructions')}
            />
            {errorFor('instructions') && <small id="instructions-error" className="field-error">{errorFor('instructions')}</small>}
          </label>
        </div>

        <button className="button primary" type="submit" disabled={!isValid || submitting}>
          {submitting ? 'Envoi…' : 'Envoyer la recette'}
        </button>
      </form>
    </section>
  );
}
