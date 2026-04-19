export const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

export function validateLogin(values) {
  const errors = {};

  if (!values.email) {
    errors.email = 'We need your email so we know where to welcome you back.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'That email looks a little off. Mind checking it once more?';
  }

  if (!values.password) {
    errors.password = 'Your password is missing. Pop it in and we are set.';
  }

  return errors;
}

export function validateRegister(values) {
  const errors = validateLogin(values);

  if (!values.fullName) {
    errors.fullName = 'What should we call you? Your name helps make this feel personal.';
  }

  if (!values.password) {
    errors.password = 'Choose a password you will remember.';
  } else if (values.password.length < 6) {
    errors.password = 'A few more characters will make that password stronger.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please re-type your password so we can double-check it.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Those passwords do not match yet.';
  }

  return errors;
}

export function validateWorkshop(values) {
  const errors = {};

  if (!values.title) errors.title = 'Give this workshop a clear, inviting title.';
  if (!values.description) errors.description = 'A short description helps people decide to join.';
  if (!values.date) errors.date = 'Pick the day so everyone can plan ahead.';
  if (!values.time) errors.time = 'What time should guests arrive?';
  if (!values.location) errors.location = 'Add a location so no one gets lost.';
  if (!values.speaker) errors.speaker = 'Who will be leading this session?';
  if (!values.capacity || Number(values.capacity) < 1) {
    errors.capacity = 'Set at least one seat so registrations make sense.';
  }

  return errors;
}
