import React, { useState, useEffect, useRef } from 'react';
import { Play, Search, BookOpen } from 'lucide-react';
import { Tasks } from './Tasks';

interface VideoSection {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail?: string;
  videoId?: string;
  pdfUrl?: string;
}

const videoSections: VideoSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'A quick overview of your Wedding Planner app and how all the sections work together.',
    duration: '4-5 min',
    videoId: 'Xz7xFJ4z6ZQ',
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Your command center - see your countdown, upcoming tasks, budget status, and recent activity.',
    duration: '2-3 min',
    videoId: 'GpVIyBu2_Iw',
  },
  {
    id: 'tasks',
    title: 'Tasks',
    description: 'Manage your wedding tasks, assign them to partners, set deadlines, and track progress.',
    duration: '2-3 min',
    videoId: 'qIBTRDYBcqI',
  },
  {
    id: 'budget',
    title: 'Budget',
    description: 'Track your wedding budget, manage expenses by category, and stay on top of payments.',
    duration: '2-3 min',
    videoId: 'xRkyu298OqE',
  },
  {
    id: 'vendors',
    title: 'Vendors',
    description: 'Manage all your wedding vendors, track contacts, contracts, and payment schedules.',
    duration: '2-3 min',
    videoId: 'ycnfzwAkhSU',
  },
  {
    id: 'guests',
    title: 'Guest List',
    description: 'Organize your guest list, track RSVPs, meal preferences, and seating arrangements.',
    duration: '2-3 min',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Customize your wedding details, manage your account, and invite your partner.',
    duration: '2-3 min',
    videoId: 'hYGjKlUaFLQ',
  },
];

const faqs = [
  {
    section: 'Dashboard',
    questions: [
      {
        q: 'What do I see on my dashboard?',
        a: 'Your dashboard shows your wedding countdown, upcoming tasks, budget overview, and recent activity. It updates in real-time as you make progress.',
      },
      {
        q: 'Can I customize what appears on my dashboard?',
        a: 'The dashboard automatically shows the most relevant information based on your wedding date and task priorities.',
      },
    ],
  },
  {
    section: 'Tasks',
    questions: [
      {
        q: 'How do I add a custom task?',
        a: 'Click the "Add Task" button, fill in the task details, and assign it to yourself or your partner. You can set deadlines and priorities.',
      },
      {
        q: 'Can I assign tasks to my partner?',
        a: 'Yes! When creating or editing a task, select your partner\'s name from the "Assigned To" dropdown.',
      },
      {
        q: 'What are the different task statuses?',
        a: 'Tasks can be Not Started, In Progress, or Completed. Update the status as you work through your tasks.',
      },
    ],
  },
  {
    section: 'Budget',
    questions: [
      {
        q: 'How do I set my wedding budget?',
        a: 'In Settings, enter your total budget. Then allocate amounts to different categories in the Budget section.',
      },
      {
        q: 'Can I track actual spending vs. budgeted amounts?',
        a: 'Yes! Each budget category shows your budgeted amount, actual spending, and remaining balance.',
      },
      {
        q: 'What if I go over budget in a category?',
        a: 'The app will show a warning and update your totals. You can adjust your budget or reduce spending in other areas.',
      },
    ],
  },
  {
    section: 'Vendors',
    questions: [
      {
        q: 'What information should I track for vendors?',
        a: 'Track vendor name, category, contact info, cost, payment schedule, and contract status.',
      },
      {
        q: 'Can I upload vendor contracts?',
        a: 'Currently, you can add notes about contracts. Document storage is coming in a future update.',
      },
      {
        q: 'How do I mark a vendor as booked?',
        a: 'Edit the vendor and change their status to "Booked". This helps you track which vendors are confirmed.',
      },
    ],
  },
  {
    section: 'Guest List',
    questions: [
      {
        q: 'How do I import my guest list?',
        a: 'Click "Import" and upload a CSV file with guest information. Download the template for the correct format.',
      },
      {
        q: 'Can I track meal preferences?',
        a: 'Yes! Each guest can have meal preferences recorded, which you can filter and export for your caterer.',
      },
      {
        q: 'How do I track RSVPs?',
        a: 'Update each guest\'s RSVP status (Pending, Accepted, Declined) as responses come in.',
      },
    ],
  },
  {
    section: 'Settings',
    questions: [
      {
        q: 'How do I invite my partner to the app?',
        a: 'In Settings, find your Join Code and share it with your partner. They\'ll use it when registering.',
      },
      {
        q: 'Can I change my wedding date?',
        a: 'Yes! Update your wedding date in Settings. This will automatically adjust your countdown and task timelines.',
      },
      {
        q: 'How do I update my account information?',
        a: 'Go to Settings to update your name, email, and password.',
      },
    ],
  },
];

export const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoSection | null>(null);
  const [showTasksHelp, setShowTasksHelp] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [highlightFilters, setHighlightFilters] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [highlightAddTask, setHighlightAddTask] = useState(false);
  const playerRef = useRef<any>(null);
  const checkIntervalRef = useRef<any>(null);

  const filteredFaqs = faqs.map(section => ({
    ...section,
    questions: section.questions.filter(
      q =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(section => section.questions.length > 0);

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      console.log('YouTube IFrame API ready');
    };
  }, []);

  useEffect(() => {
    if (activeVideo?.videoId && (window as any).YT) {
      const initPlayer = () => {
        if (playerRef.current) {
          playerRef.current.destroy();
        }

        playerRef.current = new (window as any).YT.Player('youtube-player', {
          events: {
            onStateChange: (event: any) => {
              if (event.data === (window as any).YT.PlayerState.PLAYING) {
                if (checkIntervalRef.current) {
                  clearInterval(checkIntervalRef.current);
                }

                checkIntervalRef.current = setInterval(() => {
                  if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                    const currentTime = playerRef.current.getCurrentTime();
                    const duration = playerRef.current.getDuration();

                    if (duration - currentTime <= 0.5) {
                      playerRef.current.pauseVideo();
                      if (checkIntervalRef.current) {
                        clearInterval(checkIntervalRef.current);
                      }
                    }
                  }
                }, 50);
              }
            },
          },
        });
      };

      if ((window as any).YT.Player) {
        initPlayer();
      } else {
        const checkYT = setInterval(() => {
          if ((window as any).YT && (window as any).YT.Player) {
            clearInterval(checkYT);
            initPlayer();
          }
        }, 100);
      }
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [activeVideo]);

  useEffect(() => {
    if (showTasksHelp) {
      const showModalTimer = setTimeout(() => {
        setShowTasksModal(true);
      }, 500);

      return () => {
        clearTimeout(showModalTimer);
      };
    }
  }, [showTasksHelp]);

  const handleVideoClick = (video: VideoSection) => {
    if (video.id === 'tasks' && !video.videoId) {
      setShowTasksHelp(true);
    } else {
      setActiveVideo(video);
    }
  };

  const handleCloseVideo = () => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    setActiveVideo(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Help Center</h1>
        <p className="text-gray-600">
          Learn how to use your Wedding Planner app with video tutorials and helpful guides.
        </p>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Play className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-serif font-semibold text-gray-900">Video Tutorials</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Short, focused videos to help you get the most out of each section. Videos coming soon!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoSections.map((video) => {
            const hasVideo = !!video.videoId;
            const hasPdf = !!video.pdfUrl;

            return (
              <div
                key={video.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <button
                  onClick={() => handleVideoClick(video)}
                  className="w-full aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center group cursor-pointer"
                >
                  <div className="text-center">
                    <div className="bg-white rounded-full p-4 group-hover:scale-110 transition-transform">
                      <Play className="w-12 h-12 text-primary-600 fill-primary-600" />
                    </div>
                    <p className="text-sm text-primary-700 font-medium mt-3">
                      {hasVideo ? 'Watch Video' : 'Video Coming Soon'}
                    </p>
                  </div>
                </button>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{video.title}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {video.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{video.description}</p>
                  {hasVideo && (
                    <button
                      onClick={() => handleVideoClick(video)}
                      className="inline-block mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Watch Tutorial →
                    </button>
                  )}
                  {hasPdf && (
                    <a
                      href={video.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View PDF Guide →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-serif font-semibold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredFaqs.map((section) => (
            <div key={section.section} className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{section.section}</h3>
              <div className="space-y-4">
                {section.questions.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                    <button
                      onClick={() =>
                        setActiveSection(
                          activeSection === `${section.section}-${index}`
                            ? null
                            : `${section.section}-${index}`
                        )
                      }
                      className="w-full text-left flex justify-between items-start gap-4 group"
                    >
                      <span className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                        {faq.q}
                      </span>
                      <span className="text-gray-400 flex-shrink-0">
                        {activeSection === `${section.section}-${index}` ? '−' : '+'}
                      </span>
                    </button>
                    {activeSection === `${section.section}-${index}` && (
                      <div className="mt-2 text-gray-600 pl-4">{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {searchQuery && filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No results found for "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      <div className="mt-12 bg-primary-50 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Still need help?</h3>
        <p className="text-gray-600">
          Can't find what you're looking for? We're here to help make your wedding planning easier.
        </p>
      </div>

      {activeVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={handleCloseVideo}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{activeVideo.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{activeVideo.description}</p>
              </div>
              <button
                onClick={handleCloseVideo}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold px-3"
              >
                ×
              </button>
            </div>
            <div className="relative w-full overflow-hidden" style={{ paddingTop: '56.25%' }}>
              <iframe
                id="youtube-player"
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&fs=1&iv_load_policy=3&disablekb=0&cc_load_policy=0`}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <style dangerouslySetInnerHTML={{ __html: `
                .ytp-pause-overlay,
                .ytp-scroll-min,
                .ytp-show-cards-title,
                .ytp-ce-element,
                .ytp-cards-teaser,
                .ytp-endscreen-content {
                  display: none !important;
                }
              `}} />
            </div>
          </div>
        </div>
      )}

      {showTasksHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-auto">
          <button
            onClick={() => {
              setShowTasksHelp(false);
              setShowTasksModal(false);
              setHighlightFilters(false);
              setShowSearchModal(false);
              setHighlightAddTask(false);
            }}
            className="fixed top-4 right-4 text-white hover:text-gray-300 text-4xl font-bold z-[60] w-12 h-12 flex items-center justify-center bg-black bg-opacity-50 rounded-full"
          >
            ×
          </button>

          <div className="bg-white min-h-full">
            <Tasks highlightFilters={highlightFilters} highlightAddTask={highlightAddTask} />
          </div>

          {showTasksModal && (
            <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none z-[55]">
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg mx-4 pointer-events-auto relative overflow-hidden">
                <div className="bg-[#5f9b9c] px-8 py-4 relative">
                  <button
                    onClick={() => {
                      setShowTasksModal(false);
                      setTimeout(() => {
                        setHighlightFilters(true);
                        setTimeout(() => {
                          setShowSearchModal(true);
                        }, 500);
                      }, 500);
                    }}
                    className="absolute top-3 right-4 text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center"
                  >
                    ×
                  </button>
                  <h3 className="text-white text-center text-xl font-semibold">Tasks Page</h3>
                </div>
                <p className="text-gray-800 text-lg leading-relaxed p-8">
                  This is your Tasks Page. From here you can track or update all tasks related to your wedding and reception. You can even delete tasks that do not relate to your arrangements.
                </p>
              </div>
            </div>
          )}

          {showSearchModal && (
            <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none z-[55]">
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg mx-4 pointer-events-auto relative overflow-hidden">
                <div className="bg-[#5f9b9c] px-8 py-4 relative">
                  <button
                    onClick={() => {
                      setShowSearchModal(false);
                      setHighlightFilters(false);
                      setTimeout(() => {
                        setHighlightAddTask(true);
                      }, 500);
                    }}
                    className="absolute top-3 right-4 text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center"
                  >
                    ×
                  </button>
                  <h3 className="text-white text-center text-xl font-semibold">Task Search Criteria</h3>
                </div>
                <p className="text-gray-800 text-lg leading-relaxed p-8">
                  This area is reserved for Task search criteria. Search by "Category", "Status" or "Timeline." Or, search for one specific task by entering the task name in the "Search Tasks…" textbox and pressing the "Enter" button on your keyboard.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
