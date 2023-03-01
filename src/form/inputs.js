import { useField } from "formik";
import './inputs.scss';

export const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input {...field} {...props} aria-invalid={meta.touched && meta.error ? "true": null}/>
      {meta.touched && meta.error ? (
        <p className="error">{meta.error}</p>
      ) : null}
    </>
  );
};

export const TitleEditInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input {...field} {...props} aria-invalid={meta.touched && meta.error ? "true": null}/>
      {meta.touched && meta.error ? (
        <p className="error">{meta.error}</p>
      ) : null}
    </>
  );
};

export const GroupDescriptionInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name} className='about-edit-label'>{label}</label>
      <textarea {...field} {...props} aria-invalid={meta.touched && meta.error ? "true": null}/>
      {meta.touched && meta.error ? (
        <p className="error">{meta.error}</p>
      ) : null}
    </>
  );
};

export const TextAreaInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <textarea {...field} {...props} aria-invalid={meta.touched && meta.error ? "true": null}/>
      {meta.touched && meta.error ? (
        <p className="error">{meta.error}</p>
      ) : null}
    </>
  );
};

export const DangerCheckbox = ({ children, ...props }) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' });
  return (
    <div style={{marginBottom: '1rem'}}>
    <small style={{color: 'red'}}>Dont forget to enter your allergen assement</small>
      <label>
        <input type="checkbox" {...field} {...props} />
        {children}
      </label>
      {meta.touched && meta.error ? (
        <p className="error">{meta.error}</p>
      ) : null}
    </div>
  );
};
