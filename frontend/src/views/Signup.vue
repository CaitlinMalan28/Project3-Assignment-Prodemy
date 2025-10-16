<template>
  <div class="signup-container">
    <div class="form-section">
      <h2>Create Your Account</h2>
      <p>Join Prodemy and start your learning journey</p>

      <form @submit.prevent="handleSignup">
        <input v-model="firstName" type="text" placeholder="First Name" required />
        <input v-model="lastName" type="text" placeholder="Last Name" required />
        <input v-model="email" type="email" placeholder="Email address" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required />

        <select v-model="role" required>
          <option disabled value="">Select your role</option>
          <option value="USER">Customer</option>
          <option value="ADMIN">Admin</option>
        </select>

        <label class="checkbox">
          <input type="checkbox" v-model="agreed" required />
          I agree to the terms and conditions
        </label>

        <button type="submit">Sign Up</button>
      </form>

      <p class="login-link">
        Already have an account? <router-link to="/login">Log in</router-link>
      </p>
    </div>

    <div class="graphic-section">
      <img :src="logo" alt="Prodemy Signup Graphic" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import logo from '@/assets/logo.png'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('')
const agreed = ref(false)

const handleSignup = async () => {
  if (!firstName.value || !lastName.value || !email.value || !password.value || !confirmPassword.value || !role.value || !agreed.value) {
    alert('Please fill in all fields and agree to the terms.')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }

  let endpoint = ''
  if (role.value === 'ADMIN') {
    endpoint = 'C'
  } else if (role.value === 'USER') {
    endpoint = 'http://localhost:8080/customers/register'
  } else {
    alert('Invalid role selected')
    return
  }

  try {
    const response = await axios.post(endpoint, {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      role: role.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    alert('Account created successfully!');

    // Get the user role from the response
    const user = response.data;

    if (user.role === 'ADMIN') {
      // redirect admin to dashboard
      window.location.href = '/dashboard';
    } else if (user.role === 'STUDENT') {
      // redirect student to home
      window.location.href = '/';
    } else {
      alert('Unknown role, redirecting to home');
      window.location.href = '/';
    }

  } catch (error) {
    console.error('Signup failed:', error);
    if (error.response && error.response.data) {
      alert('Signup failed: ' + JSON.stringify(error.response.data));
    } else {
      alert('Signup failed. Please try again.');
    }
  }

}
</script>


<style scoped>
.signup-container {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  background: #0d0d0d;
  color: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  border-radius: 20px;
  overflow: hidden;
}

.form-section {
  flex: 1;
  padding: 60px;
  background-color: #9eff80;
  color: #121212;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 600px;
  border-radius: 20px 0 0 20px;
}

.form-section h2 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #1e1e1e;
}

.form-section p {
  margin-bottom: 30px;
  font-weight: 500;
  color: #2b2b2b;
  font-size: 1rem;
}

form input,
form select {
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 14px;
  font-size: 1rem;
  background-color: #f6f6f6;
  color: #121212;
}

form input::placeholder {
  color: #777;
}

form input:focus,
form select:focus {
  outline: none;
  border-color: #5cae29;
  box-shadow: 0 0 6px #5cae2966;
  background-color: #fff;
}

.checkbox {
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #333;
}

.checkbox input {
  margin-right: 8px;
}

button {
  background-color: #5cae29;
  color: white;
  border: none;
  padding: 14px;
  width: 100%;
  border-radius: 14px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #489c1f;
  transform: translateY(-1px);
}

.login-link {
  text-align: center;
  margin-top: 25px;
  font-size: 0.95rem;
  color: #333;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.login-link a:hover {
  text-decoration: underline;
}

.graphic-section {
  flex: 1;
  background-color: #0d0d0d;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 0 20px 20px 0;
}

.graphic-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 0 20px 20px 0;
}
</style>
