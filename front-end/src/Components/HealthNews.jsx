import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

const articles = [
    {
        id: 1,
        date: "May 20, 2024",
        title: "5 Simple Ways to Improve Your Mental Health",
        image:
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 2,
        date: "May 15, 2024",
        title: "How to Keep Your Heart Healthy Every Day",
        image:
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 3,
        date: "May 10, 2024",
        title: "The Importance of Quality Sleep for a Healthy Life",
        image:
            "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 4,
        date: "May 05, 2024",
        title: "Easy Tips to Build a Healthier Daily Routine",
        image:
            "https://images.unsplash.com/photo-1445384763658-0400939829cd?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: 5,
        date: "April 28, 2024",
        title: "Why Regular Exercise Is Important for Your Body",
        image:
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 6,
        date: "April 22, 2024",
        title: "Healthy Eating Habits Every Family Should Follow",
        image:
            "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 7,
        date: "April 15, 2024",
        title: "Understanding the Warning Signs of High Blood Pressure",
        image:
            "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 8,
        date: "April 08, 2024",
        title: "How Staying Hydrated Can Improve Your Health",
        image:
            "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 9,
        date: "April 02, 2024",
        title: "Simple Ways to Protect Your Eyes Every Day",
        image:
            "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 10,
        date: "March 25, 2024",
        title: "The Benefits of Walking for Your Overall Health",
        image:
            "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 11,
        date: "March 18, 2024",
        title: "When Should You Schedule a Routine Health Checkup?",
        image:
            "https://images.unsplash.com/photo-1638202993928-7d113b8a8e3e?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 12,
        date: "March 10, 2024",
        title: "Practical Tips for Managing Stress at Work",
        image:
            "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=700&q=80",
    },
];

const HealthNews = () => {
    const [showAll, setShowAll] = useState(false);

    const visibleArticles = showAll ? articles : articles.slice(0, 4);

    return (
        <section className="bg-[#f8fbfe] py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">

                <div className="mb-8 text-center">
                    <p className="mb-1 text-2xl font-bold uppercase tracking-wide text-[#0066FE]">
                        Latest Articles
                    </p>

                    <h2 className="text-3xl font-bold text-[#0A1931] ">
                        Health Tips &{" "}
                        <span className="text-[#0066FE]">News</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-5  lg:grid-cols-4">
                    {visibleArticles.map((article) => (
                        <article
                            key={article.id}
                            className="overflow-hidden rounded-lg border border-[#EAF0F6] bg-white shadow-[0_6px_20px_rgba(30,70,100,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(30,70,100,0.10)]"
                        >
                            <div className="h-[150px] overflow-hidden">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                            </div>

                            <div className="p-4">
                                <p className="text-[12px] text-[#4A5568]">
                                    {article.date}
                                </p>

                                <h3 className="mt-1 min-h-[36px] text-[18px] font-bold leading-[17px] text-[#0A1931]">
                                    {article.title}
                                </h3>


                                <button
                                    type="button"
                                    className="mt-3 flex items-center gap-1 text-[14px] font-semibold text-[#0066FE] transition-colors hover:text-[#0969C7]"
                                >
                                    Read More
                                    <ArrowRight size={10} strokeWidth={2.5} />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                {articles.length > 4 && (
                    <div className="mt-6 flex justify-center">
                        <button
                            type="button"
                            onClick={() => setShowAll((prev) => !prev)}
                            className="group flex items-center gap-2 rounded-full bg-[#1683E8] px-5 py-2.5 text-[15px] font-semibold text-white shadow-[0_5px_15px_rgba(22,131,232,0.20)] transition-all duration-300 hover:bg-[#0874D1] hover:shadow-[0_7px_20px_rgba(22,131,232,0.28)] active:scale-95"
                        >
                            {showAll ? "Show Less" : "View All Articles"}

                            <ArrowRight
                                size={11}
                                strokeWidth={2.5}
                                className={`transition-transform duration-300 ${showAll
                                    ? "-rotate-90"
                                    : "group-hover:translate-x-0.5"
                                    }`}
                            />
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
};

export default HealthNews;