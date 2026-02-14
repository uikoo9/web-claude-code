import TerminalClient from '@/components/TerminalClient';

export default function TerminalPage({ params }: { params: { token: string } }) {
  // TODO: Add token verification logic here
  // const { token } = params;
  // const isValid = await verifyAccessToken(token);
  // if (!isValid) notFound();

  return <TerminalClient />;
}
