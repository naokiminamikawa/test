<template>
  <div class>
    <amplify-authenticator username-alias="email">
      <!-- The rest of your app code -->
      <amplify-sign-up slot="sign-up" username-alias="email" :form-fields.prop="formFields"></amplify-sign-up>
      <amplify-sign-out></amplify-sign-out>
    </amplify-authenticator>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formFields: [
        {
          type: "email",
          label: "Email",
          placeholder: "",
          required: true
        },
        {
          type: "password",
          label: "Password",
          placeholder: "",
          required: true
        }
      ]
    };
  }
};
</script>