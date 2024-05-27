'use client';

import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';

Amplify.configure(outputs, {
  ssr: true // required when using Amplify with Next.js
});

export function ConfigureAmplifyClientSide() {
  return null;
}
