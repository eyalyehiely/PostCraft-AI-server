import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is SEO Gen?",
      answer: "SEO Gen is an AI-powered analytics platform that helps businesses analyze and optimize their website's performance. It provides detailed insights, recommendations, and tools to improve your website's SEO and user experience."
    },
    {
      question: "How does the AI analysis work?",
      answer: "Our AI system analyzes your website using advanced algorithms to identify performance issues, SEO opportunities, and user experience improvements. It processes data from various sources to provide comprehensive insights and actionable recommendations."
    },
    {
      question: "What kind of data do you analyze?",
      answer: "We analyze various aspects of your website including Core Web Vitals, page load times, resource usage, SEO elements, accessibility features, and user experience metrics. This helps provide a complete picture of your website's performance."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security very seriously. All data is encrypted in transit and at rest. We follow industry best practices and comply with relevant data protection regulations to ensure your data remains secure."
    },
    {
      question: "How often should I run an analysis?",
      answer: "We recommend running a full analysis at least once a month, or whenever you make significant changes to your website. Regular analysis helps track improvements and identify new opportunities for optimization."
    }
  ];

  return (
    <div className="py-12 md:py-20" id="faqs">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Find answers to common questions about our platform
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 rounded-lg overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium">{faq.question}</span>
              <ChevronDownIcon
                className={`w-5 h-5 transform transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`px-6 transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96 pb-4' : 'max-h-0'
              }`}
            >
              <p className="text-gray-300">{faq.answer}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQs; 