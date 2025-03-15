from django.test import TestCase
from groq_parse import parseTranscribedText

def test_case_1():
    sample_transcription = "My name is John Doe, I was born on 1990-01-01, my annual income is $75,000, my credit score is 720, my outstanding debt is $15,000, and I have savings of $20,000."
    template_attributes = ["name", "date of birth", "annual income", "credit score", "outstanding debt", "savings"]
    result_json = parseTranscribedText(sample_transcription, template_attributes)
    print("Test Case 1:")
    print(result_json)

def test_case_2():
    sample_transcription = "I am Jane Smith, born on 1985-04-15. I have a medical history of hypertension, my blood pressure is 130/85, and my insurance policy number is INS-12345."
    template_attributes = ["name", "date of birth", "medical history", "blood pressure", "insurance policy number"]
    result_json = parseTranscribedText(sample_transcription, template_attributes)
    print("Test Case 2:")
    print(result_json)

def test_case_3():
    sample_transcription = "My name is Robert Brown, I was born on 1975-09-30. I am applying for a mortgage, my property address is 123 Main St, my desired loan amount is $250,000, and my interest rate preference is 3.5%."
    template_attributes = ["name", "date of birth", "property address", "desired loan amount", "interest rate preference"]
    result_json = parseTranscribedText(sample_transcription, template_attributes)
    print("Test Case 3:")
    print(result_json)

def test_case_4():
    sample_transcription = "Hi, I'm Lisa Johnson, born on 1992-11-05. My annual income is $90,000, I want to refinance my home, my current mortgage balance is $180,000, my property value is $300,000, and my credit score is 750."
    template_attributes = ["name", "date of birth", "annual income", "current mortgage balance", "property value", "credit score"]
    result_json = parseTranscribedText(sample_transcription, template_attributes)
    print("Test Case 4:")
    print(result_json)

def test_case_5():
    sample_transcription = "Hello, I am Michael Lee, my DOB is 1980-02-20. I have a history of diabetes, my monthly medical expense is $300, my current savings are $50,000, and my insurance claim number is CLM-98765."
    template_attributes = ["name", "date of birth", "medical history", "monthly medical expense", "current savings", "insurance claim number"]
    result_json = parseTranscribedText(sample_transcription, template_attributes)
    print("Test Case 5:")
    print(result_json)
    
def test_case_6():
    sample_transcription = "Hll, my nm is Jhn D. I wr b0rn n 1990/01/01, my annn incm is sevnty-fiv K, crdit scr is 72O, debt unks $1f5, savngs twnty K."
    template_attributes = ["name", "date of birth", "annual income", "credit score", "outstanding debt", "savings"]
    result_json = parseTranscribedText(sample_transcription, template_attributes)
    print("Test Case 6:")
    print(result_json)

def test_case_7():
    sample_transcription = (
        "My name is Sarah Connor, I was born on 1989-06-15. Sometimes I mistakenly say 1990-07-20 or even 1988-12-25, "
        "but my actual birthday is 1989-06-15. My annual income was mentioned as $55,000 in one part and $50,000 in another, "
        "and my credit score fluctuated between 700 and 710, though it is 700. Also, I mentioned outstanding debt as $10,000 "
        "and at one point $12,000, but my correct debt is $10,000."
    )
    template_attributes = ["name", "date of birth", "annual income", "credit score", "outstanding debt"]
    result_json = parseTranscribedText(sample_transcription, template_attributes)
    print("Test Case 7:")
    print(result_json)

def test_case_8():
    sample_transcription = (
        "Hello, I'm Michael Thompson. I was born on 1975-05-20 and I have been working in finance for over 25 years. "
        "My annual income is approximately $100,000 and I maintain a credit score around 690. Over the years, I've accumulated "
        "an outstanding debt of roughly $25,000, while my savings have grown to about $30,000. In addition to my financial details, "
        "I have a long work history including roles at several multinational companies, experience in investments, and a solid record "
        "of managing personal finances. I also have a medical history that includes regular checkups and minor issues that have been "
        "addressed on time. My insurance policy is current and I have been very diligent about maintaining my records. "
        "Throughout this period, I have encountered numerous financial fluctuations, updated credit reports, and revised "
        "statements of my account balances, which reflect both my growth and challenges in the economic landscape."
    )
    template_attributes = ["name", "date of birth", "annual income", "credit score", "outstanding debt", "savings", "medical history", "insurance policy"]
    result_json = parseTranscribedText(sample_transcription, template_attributes)
    print("Test Case 8:")
    print(result_json)

if __name__ == '__main__':
    test_case_1()
    test_case_2()
    test_case_3()
    test_case_4()
    test_case_5()
    test_case_6()
    test_case_7()
    test_case_8()

