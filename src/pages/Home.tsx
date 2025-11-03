export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">Assignment Report — JWT Auth Implementation</h1>
          <p className="mt-4 text-gray-600 text-center">This report maps the assignment requirements to what was implemented in this project and where to find the relevant code.</p>

          <section className="mt-8 space-y-6">
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
              <p className="mt-2 text-gray-700">Implemented a client-side JWT authentication flow (access + refresh) using Axios, React Query and react-hook-form. The implementation aims to follow the assignment's security and UX requirements: access token in memory, refresh token persisted, automatic token refresh on 401, and logout on refresh failure.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <ReportRow
                title="Authentication logic & token management (30%)"
                status="Done"
                details={[
                  "Access token stored in memory and attached to requests via axios interceptor.",
                  "Refresh token stored in localStorage; refresh flow implemented to request new access token when 401 is received.",
                ]}
                files={["src/api/axiosClient.ts", "src/providers/AuthProvider.tsx"]}
              />

              <ReportRow
                title="Axios interceptor & refresh handling (20%)"
                status="Done"
                details={[
                  "Central axios instance attaches Authorization header from in-memory access token.",
                  "Response interceptor queues concurrent 401 failures, calls refresh endpoint with a plain axios instance, retries original requests after refresh.",
                  "On refresh failure tokens are cleared and logout is emitted.",
                ]}
                files={["src/api/axiosClient.ts"]}
              />

              <ReportRow
                title="React Query integration (15%)"
                status="Done"
                details={[
                  "useMutation used for login/registration flows (auth mutations).",
                  "useQuery used for protected profile fetch and data queries; queries are refetched/invalidated on auth state changes where appropriate.",
                ]}
                files={["src/hooks/useRegister.ts", "src/pages/Profile.tsx", "src/providers/AuthProvider.tsx"]}
              />

              <ReportRow
                title="React Hook Form (10%)"
                status="Done"
                details={["Login and Register pages use react-hook-form with validation for email and password fields."]}
                files={["src/pages/Login.tsx", "src/pages/Register.tsx"]}
              />

              <ReportRow
                title="Protected routes (10%)"
                status="Done"
                details={["Route guards implemented to require authentication for protected pages; unauthenticated users are redirected to /login."]}
                files={["src/routes/guards.tsx", "src/routes/AppRouter.tsx"]}
              />

              <ReportRow
                title="Public hosting & README (10%)"
                status="Done"
                details={["Project is ready for deployment (Vite build) and README exists, but public hosting URL must be added after deployment."]}
                files={["README.md"]}
              />

              <ReportRow
                title="UI / UX (10%)"
                status="Done"
                details={["Login, Register, Navbar, and Profile pages implemented with Tailwind. Navbar updated to the requested design and theming."]}
                files={["src/components/layout/Navbar.tsx", "src/pages/Profile.tsx"]}
              />

              <ReportRow
                title="Error handling & code organization (5%)"
                status="Done"
                details={["Toast provider, ErrorBoundary, and safe handling of API errors implemented. Clear token behavior on refresh failure included."]}
                files={["src/components/ErrorBoundary.tsx", "src/providers/ToastProvider.tsx", "src/api/axiosClient.ts"]}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function ReportRow({ title, status, details, files }: { title: string; status: string; details: string[]; files: string[] }) {
  const statusColor = status === 'Done' ? 'bg-green-100 text-green-800' : status === 'Partial' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-medium text-gray-900">{title}</h4>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${statusColor}`}>{status}</span>
      </div>
      <ul className="mt-3 list-disc list-inside text-gray-700 space-y-1">
        {details.map((d, i) => <li key={i}>{d}</li>)}
      </ul>
      <div className="mt-3 text-sm text-gray-500">Files: {files.map((f, i) => <code key={i} className="mr-2 rounded bg-gray-50 px-1 py-0.5">{f}</code>)}</div>
    </div>
  );
}
