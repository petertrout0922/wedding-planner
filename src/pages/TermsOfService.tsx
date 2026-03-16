import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Registration
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">
            LIMITATION OF LIABILITY AND HOLD HARMLESS AGREEMENT
          </h1>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8">
            <p className="text-sm font-semibold text-amber-800">
              DRAFT - For Review by Legal Counsel Before Use
            </p>
          </div>

          <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mb-8">
            <p className="font-bold text-primary-900 mb-2">
              IMPORTANT LEGAL NOTICE: PLEASE READ CAREFULLY BEFORE USING THIS APPLICATION
            </p>
            <p className="text-sm text-primary-800">
              By checking the acknowledgment box and creating an account, you agree to the following terms that limit the liability of [LLC_NAME_PLACEHOLDER] and its owners, employees, and representatives.
            </p>
          </div>

          <div className="prose prose-sm max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acknowledgment of Software Nature</h2>
              <p className="text-gray-700 mb-2">
                You acknowledge and agree that this wedding planning application (the "Application") is a software tool provided to assist with wedding planning organization and coordination. You understand that:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Software may contain bugs, errors, or defects that could affect functionality</li>
                <li>Calculations, timelines, and automated features may contain inaccuracies</li>
                <li>The Application is provided as a planning tool and should not be your sole method for managing critical wedding-related tasks</li>
                <li>You are solely responsible for verifying all information, calculations, and recommendations provided by the Application</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Complete Limitation of Liability</h2>
              <p className="text-gray-700 mb-3">
                TO THE MAXIMUM EXTENT PERMITTED BY NEW JERSEY LAW, [LLC_NAME_PLACEHOLDER] AND ITS OWNERS, OFFICERS, EMPLOYEES, AGENTS, AND REPRESENTATIVES (COLLECTIVELY, "RELEASED PARTIES") SHALL NOT BE LIABLE FOR ANY DAMAGES OF ANY KIND ARISING FROM YOUR USE OF OR INABILITY TO USE THIS APPLICATION, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-3">
                <li><strong>Direct damages:</strong> Loss of data, financial losses, wasted expenses</li>
                <li><strong>Indirect damages:</strong> Lost opportunities, missed vendor bookings, unavailable venues</li>
                <li><strong>Consequential damages:</strong> Wedding delays, cancellations, vendor conflicts, lost deposits, additional expenses incurred due to application errors or failures</li>
                <li><strong>Incidental damages:</strong> Travel costs, accommodation changes, guest inconveniences</li>
                <li><strong>Special damages:</strong> Emotional distress, reputational harm, or other non-economic losses</li>
                <li><strong>Punitive damages:</strong> Any penalties or punitive awards</li>
              </ul>
              <p className="text-gray-700 mb-2">This limitation applies regardless of whether the damages arise from:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Errors, bugs, or defects in the Application code</li>
                <li>Calculation errors in budget, guest count, timeline, or other features</li>
                <li>Data loss or corruption</li>
                <li>Application crashes, downtime, or unavailability</li>
                <li>Failed or missed notifications, reminders, or alerts</li>
                <li>Inaccurate vendor information or recommendations</li>
                <li>Security breaches or unauthorized access to your data</li>
                <li>Future third-party service integration failures</li>
                <li>Any other technical or functional failures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Hold Harmless and Indemnification</h2>
              <p className="text-gray-700 mb-2">
                You agree to HOLD HARMLESS, DEFEND, and INDEMNIFY the Released Parties from and against any and all claims, damages, losses, costs, expenses (including reasonable attorney fees), and liabilities arising from or related to:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Your use or misuse of the Application</li>
                <li>Your reliance on information, calculations, or recommendations provided by the Application</li>
                <li>Any wedding-related losses, damages, or complications you experience</li>
                <li>Any disputes with vendors, venues, or third parties</li>
                <li>Your violation of these terms</li>
                <li>Your violation of any applicable laws or regulations</li>
                <li>Any data breach resulting from your failure to maintain secure login credentials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Disclaimer of Warranties</h2>
              <p className="text-gray-700 mb-2">
                THE APPLICATION IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><strong>No warranty of merchantability:</strong> The Application may not meet your specific needs</li>
                <li><strong>No warranty of fitness for a particular purpose:</strong> The Application may not be suitable for your wedding planning requirements</li>
                <li><strong>No warranty of accuracy:</strong> Information, calculations, and data may contain errors</li>
                <li><strong>No warranty of availability:</strong> The Application may experience downtime or interruptions</li>
                <li><strong>No warranty of data security:</strong> While reasonable measures are taken, no system is completely secure</li>
                <li><strong>No warranty of compatibility:</strong> The Application may not work with all devices or browsers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. User Responsibilities</h2>
              <p className="text-gray-700 mb-2">You acknowledge that you are solely responsible for:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Maintaining backup copies of all important information entered into the Application</li>
                <li>Independently verifying all calculations, dates, guest counts, and budget figures</li>
                <li>Confirming all vendor bookings, contracts, and deadlines through direct communication</li>
                <li>Not relying exclusively on Application reminders or notifications for time-sensitive tasks</li>
                <li>Securing your account credentials and preventing unauthorized access</li>
                <li>Reviewing and understanding all vendor contracts and agreements independently</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Maximum Liability Cap</h2>
              <p className="text-gray-700">
                Notwithstanding any other provision in these terms, in no event shall the total aggregate liability of [LLC_NAME_PLACEHOLDER] exceed the amount you paid for your one-time Application fee. This cap applies to all claims collectively, not per incident.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Refund Policy</h2>
              <p className="text-gray-700 mb-3">
                While [LLC_NAME_PLACEHOLDER] maintains a limited refund policy for Major Issues (as defined below), requesting or receiving a refund does NOT waive, modify, or limit this Hold Harmless Agreement. This limitation of liability remains in full effect regardless of any refund issued.
              </p>
              <p className="text-gray-700 mb-2 font-semibold">Major Issues Eligible for Refund Consideration:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-3">
                <li>Complete application failure rendering the Application inaccessible or completely non-functional for 48 or more consecutive hours</li>
                <li>Total loss of all user-entered data due to Application malfunction (not user error)</li>
                <li>Critical core features (budget tracking, guest list management, or timeline planning) being completely unusable for 7 or more consecutive days after being reported to support</li>
              </ul>
              <p className="text-gray-700 mb-2 font-semibold">NOT Considered Major Issues:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-3">
                <li>Minor bugs, glitches, or intermittent errors</li>
                <li>Calculation inaccuracies or data entry errors</li>
                <li>Temporary outages lasting less than 48 hours</li>
                <li>Partial data loss or corruption</li>
                <li>Cosmetic issues, slow performance, or user interface problems</li>
                <li>User error, misuse, or failure to understand Application features</li>
                <li>Issues caused by user's device, browser, or internet connection</li>
                <li>Third-party service failures (if applicable in the future)</li>
              </ul>
              <p className="text-gray-700">
                Refund requests must be submitted within 30 days of the qualifying Major Issue.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Third-Party Services</h2>
              <p className="text-gray-700 mb-2">
                If [LLC_NAME_PLACEHOLDER] integrates third-party services in the future (calendar synchronization, email services, vendor platforms, etc.), you acknowledge that:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>[LLC_NAME_PLACEHOLDER] is not responsible for third-party service failures, errors, or data breaches</li>
                <li>Third-party services are governed by their own terms and privacy policies</li>
                <li>Integration failures shall not constitute grounds for liability claims against [LLC_NAME_PLACEHOLDER]</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Time-Sensitive Tasks</h2>
              <p className="text-gray-700 mb-2">
                You expressly acknowledge that wedding planning involves strict deadlines and time-sensitive tasks. You agree that:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>You will NOT rely solely on Application reminders, notifications, or alerts</li>
                <li>You will maintain your own independent calendar and reminder system</li>
                <li>You are solely responsible for meeting all vendor deadlines, payment schedules, and booking windows</li>
                <li>[LLC_NAME_PLACEHOLDER] bears no responsibility if you miss critical deadlines due to Application errors or failures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Severability</h2>
              <p className="text-gray-700">
                If any provision of this Hold Harmless Agreement is found to be unenforceable or invalid under New Jersey law, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">11. Governing Law and Jurisdiction</h2>
              <p className="text-gray-700">
                This Agreement shall be governed by and construed in accordance with the laws of the State of New Jersey, without regard to its conflict of law provisions. Any disputes arising from this Agreement or your use of the Application shall be resolved exclusively in the state or federal courts located in New Jersey.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">12. Acknowledgment and Acceptance</h2>
              <p className="text-gray-700 mb-2">BY CHECKING THE ACKNOWLEDGMENT BOX BELOW, YOU CONFIRM THAT:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
                <li>You have read and fully understand this Hold Harmless Agreement</li>
                <li>You voluntarily agree to all terms and limitations set forth above</li>
                <li>You acknowledge that you are waiving significant legal rights</li>
                <li>You understand that [LLC_NAME_PLACEHOLDER] will not be liable for wedding-related losses or damages</li>
                <li>You accept full responsibility for independently verifying all Application information</li>
                <li>You agree to hold [LLC_NAME_PLACEHOLDER] harmless from all claims related to your use of the Application</li>
              </ul>
              <p className="text-gray-700 font-semibold">
                This agreement is legally binding. If you do not agree to these terms, do not check the acknowledgment box and do not use this Application.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
