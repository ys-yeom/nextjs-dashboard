'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// 양식 스키마(구조) 정의, enum 열거형
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

// id, date은 폼데이터에 생략되어 있음을 알려줌
const CreateInvoice = FormSchema.omit({ id: true, date: true });

// 송장추가
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  // 센트 단위로 변경
  const amountInCents = amount * 100;
  // 생성 날짜 만들기
  const date = new Date().toISOString().split('T')[0];
  // Test it out:
  console.log(customerId, typeof amountInCents, amountInCents, status, date);

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // 해당 경로에 대한 데이터 재검증하여 업데이트된 데이터와 캐시 데이터가 다르므로 새로운 데이터 가져옴
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// 송장수정 액션
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// 송장 삭제 액션
export async function deleteInvoice(id: string) {
  // 오류 페이지 테스트를 위해 임시로 추가, 테스트후 주석처리해야함
  // throw new Error('Failed to Delete Invoice');

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}


// 로그인폼과 연결할 인증함수
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    // 자격증명사용하여 로그인 시도
    await signIn('credentials', formData);
  } catch (error) {
    // error객체가 AuthError의 인스턴스이면
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          // 잘못된 자격증명
          return 'Invalid credentials.';
        default:
          // 그외의 오류(이메일, 비밀번호 틀린 경우)
          return 'Something went wrong.';
      }
    }
    // 인증오류가 아닌경우 error객체 던짐
    throw error;
  }finally {
    redirect('/dashboard');
  }
}
