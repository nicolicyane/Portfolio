import { profile } from "./content.js";
import { budgets, type InquiryFeedback } from "./inquiry.js";

export function Contact({ feedback }: { feedback?: InquiryFeedback }) {
  const value = (name: string) => feedback?.values?.get(name) ?? "";
  const error = (name: string) => (
    <span className="field-error" id={name + "-error"} data-error={name}>
      {feedback?.errors?.[name]}
    </span>
  );
  const field = (
    name: string,
    label: string,
    type: string,
    max: number,
    autoComplete: string,
    placeholder: string,
  ) => (
    <label>
      <span>
        {label}
        <span aria-hidden="true">*</span>
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        maxLength={max}
        minLength={name === "name" ? 2 : undefined}
        defaultValue={value(name)}
        aria-describedby={name + "-error"}
        aria-invalid={!!feedback?.errors?.[name]}
      />
      {error(name)}
    </label>
  );
  const select = (
    name: string,
    label: string,
    options: readonly string[],
    placeholder = "Select an option",
  ) => (
    <label>
      <span>
        {label}
        <span aria-hidden="true">*</span>
      </span>
      <select
        name={name}
        defaultValue={value(name)}
        required
        aria-describedby={name + "-error"}
        aria-invalid={!!feedback?.errors?.[name]}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      {error(name)}
    </label>
  );
  return (
    <section className="shell contact-layout" aria-labelledby="contact-heading">
      <div className="contact-intro">
        <h1 id="contact-heading">
          Have something in mind? Tell me what you’re working on, what you’d
          like to make, and where I can help bring it to life.
        </h1>
        <img
          className={`contact-portrait${profile.portrait ? "" : " contact-illustration"}`}
          src={profile.portrait || "/portrait.webp"}
          alt={
            profile.portrait
              ? "Nicole Licyane"
              : "Illustrated portrait of Nicole Licyane"
          }
          width={758}
          height={820}
          decoding="async"
        />
      </div>
      <form
        className="inquiry"
        action="/api/contact"
        method="post"
        data-inquiry
      >
        <div className="fields contact-primary">
          {field(
            "name",
            "Full name",
            "text",
            100,
            "name",
            "Enter your full name",
          )}
          {field("email", "Email", "email", 254, "email", "Enter your email")}
          {select(
            "budget",
            "Estimated budget",
            budgets,
            "Select a budget range",
          )}
          <label>
            <span>
              Tell me about your project<span aria-hidden="true">*</span>
            </span>
            <textarea
              name="message"
              required
              minLength={20}
              maxLength={4000}
              rows={5}
              placeholder="Enter the details"
              aria-describedby="message-error"
              aria-invalid={!!feedback?.errors?.message}
              defaultValue={value("message")}
            />
            {error("message")}
          </label>
        </div>
        <div className="trap" aria-hidden="true">
          <label>
            Leave this empty
            <input
              type="text"
              name="nickname"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>
        <div className="contact-submit">
          <button className="action" type="submit">
            Let’s get in touch
          </button>
          {profile.email && (
            <a href={`mailto:${profile.email}`}>Email me directly</a>
          )}
        </div>
        <p
          className="form-status"
          role="status"
          tabIndex={-1}
          data-form-status
          data-error-state={feedback && feedback.status >= 400 ? "" : undefined}
        >
          {feedback?.message}
        </p>
      </form>
    </section>
  );
}
